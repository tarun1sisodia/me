"use client";
import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; color: string;
};

export default function DustBurst() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const sticker = canvas?.closest(".hero-sticker") as HTMLElement | null;
    if (!canvas || !sticker) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    const src = document.createElement("canvas");
    const sctx = src.getContext("2d");
    if (!ctx || !mctx || !sctx) return;

    const img = new Image();
    img.src = "/photos/sticker-tarun-halftone.png";

    let W = 0, H = 0, S = 1;
    let snap: ImageData | null = null;
    let raf = 0, live = false, last = 0;
    let dusting = false, cx = 0, cy = 0, radius = 0, hole = 0;
    let parts: P[] = [];

    const buildSnap = () => {
      if (!img.complete || !img.naturalWidth || !src.width) return;
      sctx.clearRect(0, 0, src.width, src.height);
      sctx.drawImage(img, 0, 0, src.width, src.height);
      try {
        snap = sctx.getImageData(0, 0, src.width, src.height);
      } catch {
        snap = null;
      }
    };

    const fit = () => {
      const r = sticker.getBoundingClientRect();
      S = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      for (const c of [canvas, mask, src]) {
        c.width = Math.round(W * S);
        c.height = Math.round(H * S);
      }
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      mctx.clearRect(0, 0, mask.width, mask.height);
      hole = 0;
      buildSnap();
    };

    const colorAt = (x: number, y: number) => {
      if (!snap) return "#9aa4b5";
      const ix = Math.max(0, Math.min(snap.width - 1, Math.round(x * S)));
      const iy = Math.max(0, Math.min(snap.height - 1, Math.round(y * S)));
      const o = (iy * snap.width + ix) * 4;
      const d = snap.data;
      if (d[o + 3] < 24) return "#8b95a8";
      return "rgb(" + d[o] + "," + d[o + 1] + "," + d[o + 2] + ")";
    };

    const spawn = (x: number, y: number) => {
      const a = Math.random() * Math.PI * 2;
      const sp = 24 + Math.random() * 90;
      parts.push({
        x,
        y,
        vx: Math.cos(a) * sp + (x - cx) * 1.6,
        vy: Math.sin(a) * sp * 0.5 - (30 + Math.random() * 70),
        life: 0,
        max: 0.7 + Math.random() * 0.8,
        size: 1 + Math.random() * 2.4,
        color: Math.random() < 0.12 ? "#ff6b35" : colorAt(x, y),
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;

      if (dusting) {
        const cap = Math.min(W, H) * 0.5;
        radius = Math.min(cap, radius + dt * 260);
        mctx.fillStyle = "#fff";
        for (let k = 0; k < 26; k++) {
          const a = Math.random() * Math.PI * 2;
          const rr = radius + (Math.random() - 0.5) * 14;
          const px = cx + Math.cos(a) * rr;
          const py = cy + Math.sin(a) * rr;
          const pr = (2 + Math.random() * 5) * S;
          mctx.beginPath();
          mctx.arc(px * S, py * S, pr, 0, 7);
          mctx.fill();
          hole += pr * pr;
          if (parts.length < 420 && Math.random() < 0.5) spawn(px, py);
        }
        if (radius > 8) {
          mctx.beginPath();
          mctx.arc(cx * S, cy * S, Math.max(0, radius - 6) * S, 0, 7);
          mctx.fill();
        }
      } else {
        hole *= Math.exp(-5 * dt);
        if (hole < 300) {
          hole = 0;
          mctx.clearRect(0, 0, mask.width, mask.height);
        } else {
          mctx.globalCompositeOperation = "destination-out";
          mctx.fillStyle = "rgba(0,0,0,0.12)";
          mctx.fillRect(0, 0, mask.width, mask.height);
          mctx.globalCompositeOperation = "source-over";
        }
        radius = Math.max(0, radius - dt * 320);
      }

      parts = parts.filter((p) => (p.life += dt) < p.max);
      for (const p of parts) {
        p.vy -= 26 * dt;
        p.vx *= 1 - 1.6 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      for (const p of parts) {
        const f = 1 - p.life / p.max;
        ctx.globalAlpha = f;
        ctx.fillStyle = p.color;
        const s = p.size * S * (0.6 + 0.4 * f);
        ctx.fillRect(p.x * S, p.y * S, s, s);
      }
      ctx.globalAlpha = 1;

      if (dusting || parts.length || hole > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        live = false;
        sticker.classList.remove("is-dusting");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const start = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (!d || !isFinite(d.x) || !isFinite(d.y)) return;
      cx = Math.max(0, Math.min(W, d.x));
      cy = Math.max(0, Math.min(H, d.y));
      radius = 0;
      dusting = true;
      sticker.classList.add("is-dusting");
      if (!live) {
        live = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const end = () => {
      dusting = false;
    };

    img.onload = buildSnap;
    window.addEventListener("resize", fit);
    window.addEventListener("portrait:dust", start);
    window.addEventListener("portrait:dust-end", end);
    fit();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("portrait:dust", start);
      window.removeEventListener("portrait:dust-end", end);
    };
  }, []);

  return <canvas ref={ref} className="dust-canvas" aria-hidden="true" />;
}
