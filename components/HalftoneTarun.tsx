"use client";

// HalftoneTarun — the hero name TARUN printed as a field of halftone dots.
//
// Adapted from the provided halftone-wordmark-footer component (same dot
// physics: springs, warmth, click ring), trimmed to one word and fitted to
// this portfolio's hero instead of a footer:
//
// - The visible TARUN is the canvas. The real text stays underneath, rendered
//   transparent by CSS: WriteReveal still lays it out (so the canvas box and
//   OrbitWords' letter measurements are unchanged), still plays the write-in
//   timing, and still receives the char-lit class on tech-word hover.
// - The canvas replays those two TARUN behaviours itself: dots sweep in
//   left-to-right on the same write-in rhythm, and a highlighted letter warms
//   the dots whose ink belongs to that letter (assigned from per-letter ink
//   masks, since A tucks under T's bar and the two share columns).
// - No background is painted, so the blueprint grid shows through. Colours
//   follow the site theme: ink from --text, warm from --accent, re-read on
//   every theme change. SISODIA, the portrait, the dust burst, the marquee
//   and everything else in the hero are untouched.
//
// React + 2D canvas only. No new dependencies.

import * as React from "react";
import WriteReveal from "./WriteReveal";

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.56;
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy].
 */
function hwfStep(
  x: number,
  y: number,
  vx: number,
  vy: number,
  hx: number,
  hy: number,
  px: number,
  py: number,
  r: number,
) {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.6;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.05) * 0.84;
  vy = (vy + (hy - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

/** How warm a dot is drawn: 0 at home, 1 once it is `span` px or more away. */
function hwfWarmth(
  x: number,
  y: number,
  hx: number,
  hy: number,
  span: number,
) {
  const d = Math.hypot(x - hx, y - hy);
  return span > 0 ? Math.min(1, d / span) : 0;
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0;
}

const WORD = "TARUN";
// TARUN's write-in: 5 letters, 0.22s stagger, 0.5s per letter.
const REVEAL_MS = 5 * 220 + 500;

export default function HalftoneTarun({
  active,
  dotGap = 6,
  radius = 80,
  grain = 0,
}: {
  /** True once the loader has finished: starts the dot sweep-in. */
  active: boolean;
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number;
  /** How far the pointer pushes, in CSS px. Defaults to 80. */
  radius?: number;
  /** Print grain over the dots, 0–1. Defaults to 0: the hero already has noise. */
  grain?: number;
}) {
  const wrapRef = React.useRef<HTMLSpanElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const opts = React.useRef({ dotGap, radius, grain });
  opts.current = { dotGap, radius, grain };

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0);
    let count = 0;
    // Letter index per dot, from per-letter ink masks (see layout).
    let dotLetter = new Uint8Array(0);
    let grainTile: HTMLCanvasElement | null = null;
    let ink: number[] = [237, 237, 242];
    let warm: number[] = [255, 107, 53];
    const revealStart = active
      ? performance.now()
      : -1;

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      ink =
        hwfHex(cs.getPropertyValue("--text")) || [237, 237, 242];
      warm =
        hwfHex(cs.getPropertyValue("--accent")) || [255, 107, 53];
    };

    const layout = () => {
      const o = opts.current;
      readTheme();
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Face + weight from the element itself, so the dots match the text
      // they replace in both themes and at every viewport size.
      const cs = getComputedStyle(wrap);
      const face = `${cs.fontWeight} 100px ${cs.fontFamily}`;

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = face;
      const fit = hwfFitSize(m.measureText(WORD).width, w * 1.02);
      m.font = `${cs.fontWeight} ${fit}px ${cs.fontFamily}`;
      // Kerned origins: measuring a prefix includes the kern with the next
      // letter, so origin(k) = width(prefix k+1) - width(letter k). Summing
      // single-letter widths ignores kerning, which misassigned the T/A
      // edge dots: A tucks under T's bar, so its left-leg dots fell in T's
      // band and missed their colour on A hover (and caught it on T hover).
      const total = m.measureText(WORD).width;
      const wordLeft = (w - total) / 2;
      const origins = WORD.split("").map((ch, k) => {
        const prefix = m.measureText(WORD.slice(0, k + 1)).width;
        return wordLeft + prefix - m.measureText(ch).width;
      });
      // Centre the glyph box in the canvas box.
      const probe = m.measureText(WORD);
      const ascent = probe.actualBoundingBoxAscent || fit * 0.72;
      const descent = probe.actualBoundingBoxDescent || fit * 0.2;
      const baseline = (h - (ascent + descent)) / 2 + ascent;
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(WORD, wordLeft, baseline);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(3, o.dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      // Coverage: average alpha over a 3×3 sample of the cell.
      const sample = (data: Uint8ClampedArray, gx: number, gy: number) => {
        let sum = 0;
        for (let sy = 0; sy < 3; sy++) {
          for (let sx = 0; sx < 3; sx++) {
            const sxp = Math.min(
              w - 1,
              Math.floor(gx * gap + ((sx + 0.5) * gap) / 3),
            );
            const syp = Math.min(
              h - 1,
              Math.floor(gy * gap + ((sy + 0.5) * gap) / 3),
            );
            sum += data[(syp * w + sxp) * 4 + 3];
          }
        }
        return sum / (9 * 255);
      };
      const tmp: number[] = [];
      const cells: Array<[number, number]> = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const cov = sample(img, gx, gy);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap));
          cells.push([gx, gy]);
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;
      // Assign each dot to the letter whose ink actually covers its cell.
      // X-only bands cannot do this: where A tucks under T's bar the two
      // letters share columns, so only the ink itself separates them.
      dotLetter = new Uint8Array(count);
      const best = new Float32Array(count);
      for (let k = 0; k < WORD.length; k++) {
        const lm = document.createElement("canvas");
        lm.width = w;
        lm.height = h;
        const lc = lm.getContext("2d", { willReadFrequently: true });
        if (!lc) continue;
        lc.font = `${cs.fontWeight} ${fit}px ${cs.fontFamily}`;
        lc.fillStyle = "#000";
        lc.textBaseline = "alphabetic";
        lc.fillText(WORD[k], origins[k], baseline);
        const ldata = lc.getImageData(0, 0, w, h).data;
        for (let i = 0; i < count; i++) {
          const covL = sample(ldata, cells[i][0], cells[i][1]);
          if (covL > best[i]) {
            best[i] = covL;
            dotLetter[i] = k;
          }
        }
      }

      grainTile = document.createElement("canvas");
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext("2d");
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      awake = true;
    };

    // The letter OrbitWords is highlighting, if any (same event Hero uses).
    let lit: string | null = null;
    const onHighlight = (e: Event) => {
      lit = (e as CustomEvent<string | null>).detail;
      wake();
    };

    const revealEdge = (now: number) => {
      if (revealStart < 0) return -1;
      if (reduced) return w;
      const t = Math.min(1, (now - revealStart) / REVEAL_MS);
      return t * w;
    };

    const draw = (now: number) => {
      const o = opts.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = !reduced ? Math.max(0, o.radius) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.9;
      const edge = revealEdge(now);
      const litIdx =
        lit != null ? WORD.indexOf(lit.toUpperCase()) : -1;
      let moving = false;
      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        // Before the loader finishes, the word stays hidden.
        if (edge < 0) continue;
        // Write-in sweep: dots appear left-to-right with a soft edge.
        let scale = 1;
        if (edge >= 0) {
          const t = edge - hx;
          if (t < -8) continue;
          if (t < 8) scale = (t + 8) / 16;
        }
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r);
          x = s[0];
          y = s[1];
          vx = s[2];
          vy = s[3];
          if (
            Math.abs(vx) + Math.abs(vy) > 0.02 ||
            Math.abs(x - hx) + Math.abs(y - hy) > 0.05
          )
            moving = true;
          else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }
        let k = hwfWarmth(x, y, hx, hy, 28);
        if (litIdx >= 0 && dotLetter[i] === litIdx) k = 1;
        ctx.fillStyle =
          k > 0.02
            ? "rgb(" +
              Math.round(ink[0] + (warm[0] - ink[0]) * k) +
              "," +
              Math.round(ink[1] + (warm[1] - ink[1]) * k) +
              "," +
              Math.round(ink[2] + (warm[2] - ink[2]) * k) +
              ")"
            : `rgb(${ink[0]},${ink[1]},${ink[2]})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.1, dots[j + 6] * scale), 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(grainTile, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      // Sleep once everything is home, revealed, and nothing is pushing.
      awake =
        moving ||
        ringAge < 900 ||
        px > -1e4 ||
        (edge >= 0 && edge < w);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      if ((e.target as HTMLElement).closest("a,button")) return;
      const p = toLocal(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    };
    const onTheme = () => {
      readTheme();
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("name:highlight", onHighlight);
    window.addEventListener("theme:change", onTheme);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true });
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(wrap);
    // A web font that lands late re-sets the word in its real face.
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        layout();
        wake();
      });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("name:highlight", onHighlight);
      window.removeEventListener("theme:change", onTheme);
    };
  }, [active]);

  return (
    <span ref={wrapRef} className="halftone-tarun">
      <WriteReveal text="TARUN" active={active} className="name-tarun" />
      <canvas ref={canvasRef} className="halftone-tarun-canvas" aria-hidden="true" />
    </span>
  );
}
