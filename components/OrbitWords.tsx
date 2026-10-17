"use client";
import { useCallback, useRef, useState, type MouseEvent } from "react";

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
      const iy = br.height * 0.12;
      const sx1 = bx + ix;
      const sy1 = by + iy;
      const sx2 = bx + br.width - ix;
      const sy2 = by + br.height - iy;
      const subs: string[] = [];
      const pushH = (a: number, b: number) => {
        if (Math.abs(b - a) < 0.5) return;
        subs.push(`M ${a} ${y1} H ${b}`);
        ex = b;
        ey = y1;
      };
      const pushV = (a: number, b: number) => {
        if (Math.abs(b - a) < 0.5) return;
        subs.push(`M ${x2} ${a} V ${b}`);
        ex = x2;
        ey = b;
      };
      const dustPush = (x: number, y: number) =>
        dustPts.push({ x: x - bx, y: y - by });
      if (y1 < sy1 || y1 > sy2) {
        pushH(x1, x2);
      } else if (x1 < x2) {
        if (x1 < sx1) pushH(x1, Math.min(x2, sx1));
        if (x2 > sx1 && x1 < sx2) {
          dustPush(Math.max(x1, sx1), y1);
          dustPush(Math.min(x2, sx2), y1);
        }
        if (x2 > sx2) pushH(sx2, x2);
      } else {
        if (x1 > sx2) pushH(x1, Math.max(x2, sx2));
        if (x2 < sx2 && x1 > sx1) {
          dustPush(Math.min(x1, sx2), y1);
          dustPush(Math.max(x2, sx1), y1);
        }
        if (x2 < sx1) pushH(sx1, x2);
      }
      if (x2 < sx1 || x2 > sx2) {
        pushV(y1, y2);
      } else if (y1 < y2) {
        if (y1 < sy1) pushV(y1, Math.min(y2, sy1));
        if (y2 > sy1 && y1 < sy2) {
          dustPush(x2, Math.max(y1, sy1));
          dustPush(x2, Math.min(y2, sy2));
        }
        if (y2 > sy2) pushV(sy2, y2);
      } else {
        if (y1 > sy2) pushV(y1, Math.max(y2, sy2));
        if (y2 < sy2 && y1 > sy1) {
          dustPush(x2, Math.min(y1, sy2));
          dustPush(x2, Math.max(y2, sy1));
        }
        if (y2 < sy1) pushV(sy1, y2);
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

  const onLeave = () => {
    setHovered(null);
    setTrace(null);
    highlight(null);
    dustRef.current = null;
    window.dispatchEvent(new CustomEvent("portrait:dust-end"));
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
          <circle cx={trace.dx} cy={trace.dy} r="3.5" className="orbit-dot" />
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
            onMouseLeave={onLeave}
            onFocus={() => onEnter(i)}
            onBlur={onLeave}
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
