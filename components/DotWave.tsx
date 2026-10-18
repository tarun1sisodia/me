"use client";
import { useEffect, useRef } from "react";

const ACCENT = "255,107,53";
const COLS = 56;
const ROWS = 8;

type Star = { x: number; y: number; vx: number; vy: number; r: number; ph: number };

export default function DotWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let t = 0;
    let stars: Star[] = [];

    const seedStars = () => {
      stars = Array.from({ length: 16 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 1.8,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const frozen = reduced || document.documentElement.classList.contains("motion-off");
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.44;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ACCENT},0.26)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      const sa = t * 0.4;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(sa) * R, cy + Math.sin(sa) * R, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT},0.9)`;
      ctx.fill();

      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const x = (c / (COLS - 1)) * w;
          const swell = Math.sin((r / (ROWS - 1)) * Math.PI);
          const y = (r / (ROWS - 1)) * h + Math.sin(c * 0.32 + t * 1.7) * 13 * swell;
          const glow = 0.5 + 0.5 * Math.sin(c * 0.32 + t * 1.7);
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ACCENT},${(0.14 + glow * 0.62).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (!frozen) {
        for (const s of stars) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
      }
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${ACCENT},${(0.22 * (1 - d / 130)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      for (const s of stars) {
        const tw = frozen ? 0.8 : 0.55 + 0.45 * Math.sin(t * 2.2 + s.ph);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT},${tw.toFixed(3)})`;
        ctx.fill();
      }

      if (!frozen) t += 0.016;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="dotwave-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="dotwave-canvas" />
      <p className="dotwave-caption">DOT.MATRIX — LIVE</p>
    </div>
  );
}
