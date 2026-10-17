"use client";
import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; color: string;
};
type Pt = { x: number; y: number };

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
    let dusting = false, hole = 0;
    let path: Pt[] = [];
    let hx = 0, hy = 0, seg = 0, arrived = true;
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
        vx: Math.cos(a) * sp + (x - hx) * 1.6,
        vy: Math.sin(a) * sp * 0.5 - (30 + Math.random() * 70),
        life: 0,
        max: 0.7 + Math.random() * 0.8,
        size: 1 + Math.random() * 2.4,
        color: Math.random() < 0.12 ? "#00e5ff" : colorAt(x, y),
      });
    };

    const punch = (x: number, y: number) => {
      mctx.fillStyle = "#fff";
      for (let k = 0; k < 10; k++) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.random() * 22;
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        const pr = (9 + Math.random() * 15) * S;
        mctx.beginPath();
        mctx.arc(px * S, py * S, pr, 0, 7);
        mctx.fill();
        hole += pr * pr;
        if (parts.length < 420 && Math.random() < 0.6) spawn(px, py);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;

      if (dusting && !arrived) {
        let move = 520 * dt;
        while (move > 0 && !arrived) {
          const t = path[seg + 1];
          const dx = t.x - hx;
          const dy = t.y - hy;
          const len = Math.hypot(dx, dy);
          if (len <= move) {
            hx = t.x;
            hy = t.y;
            move -= len;
            seg++;
            if (seg >= path.length - 1) arrived = true;
          } else {
            hx += (dx / len) * move;
            hy += (dy / len) * move;
            move = 0;
          }
        }
        punch(hx, hy);
      } else if (!dusting) {
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
      const d = (e as CustomEvent<{ pts: Pt[] }>).detail;
      if (!d || !d.pts || d.pts.length < 2) return;
      path = d.pts.map((p) => ({
        x: Math.max(0, Math.min(W, p.x)),
        y: Math.max(0, Math.min(H, p.y)),
      }));
      hx = path[0].x;
      hy = path[0].y;
      seg = 0;
      arrived = false;
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
