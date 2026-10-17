"use client";
import { useEffect, useRef, useState } from "react";

const BPM = 100;
const STEPS = 32;
const STEP = 60 / BPM / 4;

const mf = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

const KICK = [0, 6, 8, 14, 16, 22, 24, 30];
const SNARE = [4, 12, 20, 28];
const HAT = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
const OPEN_HAT = [14, 30];

const BASS: [number, number][] = [
  [0, 50], [3, 50], [6, 62], [8, 50], [11, 55], [14, 57],
  [16, 43], [19, 43], [22, 59], [24, 48], [27, 52], [30, 61],
];
const CHORDS: [number, number[]][] = [
  [2, [53, 57, 60, 64]],
  [10, [53, 57, 60, 64]],
  [18, [53, 59, 64]],
  [26, [52, 55, 59, 62]],
  [30, [55, 61, 64]],
];
const LEAD: [number, number][] = [
  [0, 76], [3, 74], [6, 72], [12, 71], [16, 74], [19, 76], [24, 79], [28, 76],
];

export default function MusicToggle() {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const delaySend = useRef<GainNode | null>(null);
  const timer = useRef<number>(0);
  const step = useRef(0);
  const nextT = useRef(0);

  const ensure = () => {
    if (!ac.current) {
      const Ctx = window.AudioContext;
      ac.current = new Ctx();
      master.current = ac.current.createGain();
      master.current.gain.value = 0.5;
      master.current.connect(ac.current.destination);
      const dl = ac.current.createDelay(1);
      dl.delayTime.value = 0.45;
      const fb = ac.current.createGain();
      fb.gain.value = 0.32;
      const wet = ac.current.createGain();
      wet.gain.value = 0.22;
      delaySend.current = ac.current.createGain();
      delaySend.current.connect(dl);
      dl.connect(fb);
      fb.connect(dl);
      dl.connect(wet);
      wet.connect(master.current);
    }
    if (ac.current.state === "suspended") ac.current.resume();
  };

  const noiseBuf = () => {
    const ctx = ac.current!;
    const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  };
  const nbuf = useRef<AudioBuffer | null>(null);

  const kick = (t: number) => {
    const ctx = ac.current!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g);
    g.connect(master.current!);
    o.start(t);
    o.stop(t + 0.16);
  };

  const snare = (t: number) => {
    const ctx = ac.current!;
    const s = ctx.createBufferSource();
    s.buffer = nbuf.current;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    s.connect(f);
    f.connect(g);
    g.connect(master.current!);
    s.start(t);
    s.stop(t + 0.15);
  };

  const hat = (t: number, open: boolean) => {
    const ctx = ac.current!;
    const s = ctx.createBufferSource();
    s.buffer = nbuf.current;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 8000;
    const g = ctx.createGain();
    const dur = open ? 0.16 : 0.035;
    g.gain.setValueAtTime(open ? 0.22 : 0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master.current!);
    s.start(t);
    s.stop(t + dur + 0.02);
  };

  const bass = (t: number, m: number) => {
    const ctx = ac.current!;
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = "triangle";
    o2.type = "sine";
    o.frequency.value = mf(m);
    o2.frequency.value = mf(m - 12);
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(220, t + 0.18);
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(f);
    o2.connect(f);
    f.connect(g);
    g.connect(master.current!);
    o.start(t);
    o.stop(t + 0.24);
    o2.start(t);
    o2.stop(t + 0.24);
  };

  const chord = (t: number, notes: number[]) => {
    const ctx = ac.current!;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    f.connect(g);
    g.connect(master.current!);
    for (const m of notes) {
      for (const det of [-4, 4]) {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = mf(m);
        o.detune.value = det;
        o.connect(f);
        o.start(t);
        o.stop(t + 0.55);
      }
    }
  };

  const pluck = (t: number, m: number) => {
    const ctx = ac.current!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = "square";
    o.frequency.value = mf(m);
    f.type = "lowpass";
    f.frequency.setValueAtTime(3200, t);
    f.frequency.exponentialRampToValueAtTime(600, t + 0.25);
    g.gain.setValueAtTime(0.14, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(f);
    f.connect(g);
    g.connect(master.current!);
    g.connect(delaySend.current!);
    o.start(t);
    o.stop(t + 0.35);
  };

  const schedule = () => {
    const ctx = ac.current!;
    while (nextT.current < ctx.currentTime + 0.12) {
      const s = step.current;
      const t = nextT.current;
      if (KICK.includes(s)) kick(t);
      if (SNARE.includes(s)) snare(t);
      if (HAT.includes(s)) hat(t, false);
      if (OPEN_HAT.includes(s)) hat(t, true);
      for (const [st, m] of BASS) if (st === s) bass(t, m);
      for (const [st, ns] of CHORDS) if (st === s) chord(t, ns);
      for (const [st, m] of LEAD) if (st === s) pluck(t, m);
      nextT.current += STEP;
      step.current = (s + 1) % STEPS;
    }
  };

  const toggle = () => {
    if (on) {
      window.clearInterval(timer.current);
      setOn(false);
      return;
    }
    ensure();
    if (!nbuf.current) nbuf.current = noiseBuf();
    step.current = 0;
    nextT.current = ac.current!.currentTime + 0.06;
    timer.current = window.setInterval(schedule, 25);
    setOn(true);
  };

  useEffect(
    () => () => {
      window.clearInterval(timer.current);
      ac.current?.close();
    },
    []
  );

  return (
    <button
      type="button"
      className="music-toggle"
      aria-pressed={on}
      onClick={toggle}
      aria-label={on ? "Turn background beat off" : "Turn background beat on"}
    >
      <span className="music-eq" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      BEAT {on ? "ON" : "OFF"}
    </button>
  );
}
