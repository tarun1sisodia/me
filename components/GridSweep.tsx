"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

// The 14 background lines are guitar strings: E minor pentatonic,
// low to high left to right, so a strum either way always sounds good.
const NOTES = [
  82.41, 98.0, 110.0, 123.47, 146.83, 164.81, 196.0, 220.0, 246.94, 293.66,
  329.63, 392.0, 440.0, 493.88,
];

// Plucked-string sound, synthesized with Karplus-Strong into a buffer
// (no audio files). Computed once per note, then cached.
function ksBuffer(ctx: AudioContext, freq: number, seconds = 2): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.round(sr / freq);
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  const ring = new Float32Array(n);
  for (let i = 0; i < n; i++) ring[i] = Math.random() * 2 - 1;
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const cur = ring[idx];
    const next = ring[(idx + 1) % n];
    out[i] = cur;
    ring[idx] = 0.5 * (cur + next) * 0.996;
    idx = (idx + 1) % n;
  }
  return buf;
}

export default function GridSweep({ lines = 14 }: { lines?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const state = useRef({
    ctx: null as AudioContext | null,
    master: null as GainNode | null,
    bufs: new Map<number, AudioBuffer>(),
    centers: [] as number[],
    lastString: -1,
    lastPluck: 0,
    raf: new Map<HTMLElement, number>(),
  });

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;
    const section = root.closest(".interlude") as HTMLElement | null;
    if (!section) return;
    const s = state.current;

    const measure = () => {
      const spans = Array.from(
        root.querySelectorAll<HTMLElement>(".gridsweep-line")
      );
      const secLeft = section.getBoundingClientRect().left;
      s.centers = spans.map(
        (el) =>
          el.getBoundingClientRect().left +
          el.getBoundingClientRect().width / 2 -
          secLeft
      );
    };
    measure();
    window.addEventListener("resize", measure);

    const ensureAudio = () => {
      try {
        if (!s.ctx) {
          const AC =
            window.AudioContext ||
            (
              window as unknown as {
                webkitAudioContext?: typeof AudioContext;
              }
            ).webkitAudioContext;
          if (!AC) return false;
          s.ctx = new AC();
          s.master = s.ctx.createGain();
          s.master.gain.value = 0.6;
          s.master.connect(s.ctx.destination);
        }
        if (s.ctx.state === "suspended") void s.ctx.resume();
        return s.ctx.state === "running";
      } catch {
        return false;
      }
    };

    const play = (freq: number) => {
      if (!ensureAudio() || !s.ctx || !s.master) return;
      try {
        let buf = s.bufs.get(freq);
        if (!buf) {
          buf = ksBuffer(s.ctx, freq);
          s.bufs.set(freq, buf);
        }
        const src = s.ctx.createBufferSource();
        src.buffer = buf;
        const g = s.ctx.createGain();
        g.gain.value = 0.08;
        src.connect(g);
        g.connect(s.master);
        src.start();
      } catch {
        // Audio is a bonus; never break the page over it.
      }
    };

    const vibrate = (el: HTMLElement) => {
      const prev = s.raf.get(el);
      if (prev) cancelAnimationFrame(prev);
      el.classList.add("plucked");
      const start = performance.now();
      const dur = 650;
      const step = (t: number) => {
        const p = (t - start) / dur;
        if (p >= 1) {
          el.style.transform = "";
          el.classList.remove("plucked");
          s.raf.delete(el);
          return;
        }
        const x =
          5 *
          Math.exp(-p * 5) *
          Math.sin((2 * Math.PI * 30 * (p * dur)) / 1000);
        el.style.transform = `translateX(${x.toFixed(2)}px)`;
        s.raf.set(el, requestAnimationFrame(step));
      };
      s.raf.set(el, requestAnimationFrame(step));
    };

    const pluck = (i: number) => {
      const spans = root.querySelectorAll<HTMLElement>(".gridsweep-line");
      const el = spans[i];
      if (!el) return;
      s.lastString = i;
      s.lastPluck = performance.now();
      play(NOTES[i % NOTES.length]);
      vibrate(el);
    };

    const nearest = (x: number) => {
      let best = 0;
      let bestD = Infinity;
      s.centers.forEach((c, i) => {
        const d = Math.abs(c - x);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 0 || x > rect.width) {
        s.lastString = -1;
        return;
      }
      const i = nearest(x);
      const now = performance.now();
      if (i !== s.lastString && now - s.lastPluck >= 40) pluck(i);
    };

    const onDown = (e: PointerEvent) => {
      ensureAudio();
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 0 || x > rect.width) return;
      pluck(nearest(x));
    };

    const onLeave = () => {
      s.lastString = -1;
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", measure);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointerleave", onLeave);
      s.raf.forEach((id) => cancelAnimationFrame(id));
    };
  }, [reduced, lines]);

  return (
    <div className="gridsweep" aria-hidden="true" ref={ref}>
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="gridsweep-line" />
      ))}
      <span className="gridsweep-band" />
    </div>
  );
}
