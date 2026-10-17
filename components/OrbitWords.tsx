"use client";
import { useCallback, useRef, useState, type MouseEvent } from "react";
import { maskReady, solidAt } from "@/lib/stickerMask";

type Word = {
  w: string;
  tech: string;
  letter: string;
  left?: string;
  right?: string;
  top: string;
  c: string;
  d: string;
  dl: string;
};

const WORDS: Word[] = [
  { w: "typescript", tech: "TypeScript", letter: "T", left: "7%", top: "16%", c: "", d: "6s", dl: "0s" },
  { w: "react", tech: "React", letter: "R", left: "21%", top: "6%", c: "c-white", d: "7.2s", dl: "-3s" },
  { w: "fastapi", tech: "FastAPI", letter: "A", right: "8%", top: "22%", c: "c-cyan", d: "7.5s", dl: "-2s" },
  { w: "security", tech: "Security", letter: "U", right: "21%", top: "8%", c: "", d: "8.4s", dl: "-5s" },
  { w: "node.js", tech: "Node.js", letter: "N", right: "7%", top: "39%", c: "c-white", d: "7s", dl: "-1.5s" },
  { w: "docker", tech: "Docker", letter: "R", left: "11%", top: "60%", c: "c-cyan", d: "8s", dl: "-4s" },
  { w: "postgresql", tech: "PostgreSQL", letter: "T", right: "10%", top: "56%", c: "", d: "6.8s", dl: "-1s" },
  { w: "redis", tech: "Redis", letter: "R", left: "15%", top: "84%", c: "", d: "7.8s", dl: "-2.5s" },
  { w: "ship it", tech: "", letter: "T", right: "16%", top: "82%", c: "c-cyan", d: "6.4s", dl: "-0.8s" },
];

type Trace = { d: string; dx: number; dy: number };

export default function OrbitWords() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dustRef = useRef<{ pts: { x: number; y: number }[] } | null>(null);

  const measure = useCallback((i: number) => {
    const word = wordRefs.current[i];
    const stage = word?.closest(".hero-stage");
    const chars = stage?.querySelectorAll(".write-reveal.name-tarun .write-char");
    const letterEl = chars
      ? Array.from(chars).find(
          (el) => el.textContent?.toUpperCase() === WORDS[i].letter
        )
      : null;
    const sticker = stage?.querySelector(".hero-sticker") as HTMLElement | null;
    if (!word || !stage || !letterEl) return;
    const sr = stage.getBoundingClientRect();
    const wr = word.getBoundingClientRect();
    const lr = (letterEl as HTMLElement).getBoundingClientRect();
    const x1 = wr.left - sr.left + wr.width / 2;
    const y1 = wr.top - sr.top + wr.height / 2;
    const x2 = lr.left - sr.left + lr.width / 2;
    const y2 = lr.top - sr.top + 4;
    let d = `M ${x1} ${y1} H ${x2} V ${y2}`;
    let ex = x2;
    let ey = y2;
    const dustPts: { x: number; y: number }[] = [];
    if (sticker) {
      const br = sticker.getBoundingClientRect();
      const bx = br.left - sr.left;
      const by = br.top - sr.top;
      const ix = br.width * 0.12;
      const it = br.height * 0.1;
      const ib = br.height * 0.24;
      const boxSolid = (x: number, y: number) =>
        x >= bx + ix &&
        x <= bx + br.width - ix &&
        y >= by + it &&
        y <= by + br.height - ib;
      const solid = (x: number, y: number) =>
        maskReady()
          ? solidAt((x - bx) / br.width, (y - by) / br.height)
          : boxSolid(x, y);
      const subs: string[] = [];
      const walk = (
        ax: number,
        ay: number,
        bx2: number,
        by2: number,
        emit: (ax1: number, ay1: number, bx1: number, by1: number) => void
      ) => {
        const len = Math.hypot(bx2 - ax, by2 - ay);
        const n = Math.max(2, Math.ceil(len / 5));
        let start = 0;
        let cur = solid(ax, ay);
        const flush = (i: number, s: boolean) => {
          if (i === start) return;
          const ax1 = ax + (bx2 - ax) * (start / n);
          const ay1 = ay + (by2 - ay) * (start / n);
          const bx1 = ax + (bx2 - ax) * (i / n);
          const by1 = ay + (by2 - ay) * (i / n);
          if (s) {
            dustPts.push({ x: ax1 - bx, y: ay1 - by }, { x: bx1 - bx, y: by1 - by });
          } else {
            emit(ax1, ay1, bx1, by1);
          }
        };
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          const s = solid(ax + (bx2 - ax) * t, ay + (by2 - ay) * t);
          if (s !== cur) {
            flush(i - 1, cur);
            start = i - 1;
            cur = s;
          }
        }
        flush(n, cur);
      };
      const emitH = (ax1: number, ay1: number, bx1: number) => {
        if (Math.abs(bx1 - ax1) < 1) return;
        subs.push(`M ${ax1} ${ay1} H ${bx1}`);
        ex = bx1;
        ey = ay1;
      };
      const emitV = (ax1: number, ay1: number, bx1: number, by1: number) => {
        if (Math.abs(by1 - ay1) < 1) return;
        subs.push(`M ${ax1} ${ay1} V ${by1}`);
        ex = ax1;
        ey = by1;
      };
      walk(x1, y1, x2, y1, (a, _y, b) => emitH(a, y1, b));
      walk(x2, y1, x2, y2, (a, ay1, _b, by1) => emitV(a, ay1, a, by1));
      if (Math.abs(ey - y2) > 2 || Math.abs(ex - x2) > 2) {
        const from = y2 > y1 ? y2 - 24 : y2 + 24;
        subs.push(`M ${x2} ${from} V ${y2}`);
        ex = x2;
        ey = y2;
      }
      d = subs.join(" ");
    }
    setTrace({ d, dx: ex, dy: ey });
    dustRef.current = dustPts.length > 1 ? { pts: dustPts } : null;
  }, []);

  const highlight = (letter: string | null) => {
    window.dispatchEvent(new CustomEvent("name:highlight", { detail: letter }));
  };

  const onEnter = (i: number) => {
    measure(i);
    setHovered(i);
    highlight(WORDS[i].letter);
    if (dustRef.current) {
      window.dispatchEvent(
        new CustomEvent("portrait:dust", { detail: dustRef.current })
      );
    }
  };

  const clearHover = () => {
    setHovered(null);
    setTrace(null);
    highlight(null);
    dustRef.current = null;
    window.dispatchEvent(new CustomEvent("portrait:dust-end"));
  };

  const onLeave = (i: number) => {
    if (wordRefs.current[i] === document.activeElement) return;
    clearHover();
  };

  const onClick = (e: MouseEvent, tech: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("work:filter", { detail: tech }));
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {hovered !== null && trace && (
        <svg className="orbit-lines" aria-hidden="true" key={hovered}>
          <path d={trace.d} pathLength={1} className="orbit-line" />
          <circle cx={trace.dx} cy={trace.dy} r="4.5" className="orbit-dot" />
        </svg>
      )}
      <div className="orbit-words">
        {WORDS.map((item, i) => (
          <button
            key={item.w}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            type="button"
            className={`orbit-word ${item.c}`}
            style={{
              left: item.left,
              right: item.right,
              top: item.top,
              animationDuration: item.d,
              animationDelay: item.dl,
            }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            onFocus={() => onEnter(i)}
            onBlur={clearHover}
            onClick={(e) => onClick(e, item.tech)}
            aria-label={
              item.tech
                ? `Show projects built with ${item.tech}`
                : "Show all selected work"
            }
            data-cursor="GO"
          >
            {item.w}
          </button>
        ))}
      </div>
    </>
  );
}
