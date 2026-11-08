// Shared plucked-string guitar engine, used by the Interlude background
// lines and the Process divider lines.
//
// A real guitar string is fixed at both ends, so when plucked it bows
// most at the middle and not at all at the ends. The visual below does
// exactly that: an SVG path whose Bezier control point is animated with
// a decaying sine, so the string stretches from the middle. (A quadratic
// Bezier's midpoint sits at half the control offset, so the control
// moves twice the visible bow.)

export const GUITAR_NOTES = [
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

class GuitarAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bufs = new Map<number, AudioBuffer>();

  private ensure(): boolean {
    try {
      if (!this.ctx) {
        const AC =
          window.AudioContext ||
          (
            window as unknown as {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.6;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx.state === "running";
    } catch {
      return false;
    }
  }

  unlock() {
    this.ensure();
  }

  // A single UI tick — the radio-button click heard when going back.
  // One short sine blip (1800 Hz, ~60 ms, fast decay), quiet on
  // purpose. Same engine and unlock rules as the strings: it is a
  // bonus, so it never throws and never blocks navigation.
  tick() {
    if (!this.ensure() || !this.ctx || !this.master) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1800;
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      // Audio is a bonus; never break the page over it.
    }
  }

  play(freq: number) {
    if (!this.ensure() || !this.ctx || !this.master) return;
    try {
      let buf = this.bufs.get(freq);
      if (!buf) {
        buf = ksBuffer(this.ctx, freq);
        this.bufs.set(freq, buf);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain();
      g.gain.value = 0.08;
      src.connect(g);
      g.connect(this.master);
      src.start();
    } catch {
      // Audio is a bonus; never break the page over it.
    }
  }
}

// One shared audio engine for every guitar string on the page.
export const guitarAudio = new GuitarAudio();

// The back-navigation tick, as a plain function for click handlers.
export function playTick() {
  guitarAudio.tick();
}

export type StringGeometry = {
  // true = string runs left->right (bow is vertical),
  // false = string runs top->bottom (bow is horizontal).
  horizontal: boolean;
  // The constant coordinate: y for a horizontal string, x for a vertical one.
  fixed: number;
  // The string's length in px.
  length: number;
};

const bowRafs = new WeakMap<SVGPathElement, number>();

function pathD(g: StringGeometry, off: number): string {
  const f = g.fixed.toFixed(1);
  const l = g.length.toFixed(1);
  const mid = (g.length / 2).toFixed(1);
  return g.horizontal
    ? `M 0 ${f} Q ${mid} ${(g.fixed + off).toFixed(2)} ${l} ${f}`
    : `M ${f} 0 Q ${(g.fixed + off).toFixed(2)} ${mid} ${f} ${l}`;
}

// Pluck an SVG path string: it bows from the middle with a decaying
// sine, then settles back to straight. Re-plucking restarts the motion.
// Adds the "plucked" class for the accent glow while it vibrates.
export function bowString(
  path: SVGPathElement,
  g: StringGeometry,
  amplitude = 10,
  duration = 650
): () => void {
  const prev = bowRafs.get(path);
  if (prev) cancelAnimationFrame(prev);
  path.classList.add("plucked");
  const start = performance.now();
  const step = (t: number) => {
    const p = (t - start) / duration;
    if (p >= 1) {
      path.setAttribute("d", pathD(g, 0));
      path.classList.remove("plucked");
      bowRafs.delete(path);
      return;
    }
    const bow =
      amplitude *
      Math.exp(-p * 5) *
      Math.sin((2 * Math.PI * 30 * (p * duration)) / 1000);
    path.setAttribute("d", pathD(g, 2 * bow));
    bowRafs.set(path, requestAnimationFrame(step));
  };
  bowRafs.set(path, requestAnimationFrame(step));
  return () => {
    const id = bowRafs.get(path);
    if (id) cancelAnimationFrame(id);
    bowRafs.delete(path);
    path.setAttribute("d", pathD(g, 0));
    path.classList.remove("plucked");
  };
}
