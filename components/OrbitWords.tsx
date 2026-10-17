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
    const dustPts: { x: number; y: number }[] = [];
    if (sticker) {
      const br = sticker.getBoundingClientRect();
      const bx = br.left - sr.left;
      const by = br.top - sr.top;
      const sx1 = bx;
      const sy1 = by;
      const sx2 = bx + br.width;
      const sy2 = by + br.height;
      const subs: string[] = [];
      const hlo = Math.min(x1, x2);
      const hhi = Math.max(x1, x2);
      if (y1 < sy1 || y1 > sy2) {
        subs.push(`M ${x1} ${y1} H ${x2}`);
      } else {
        const l = Math.min(hhi, sx1);
        if (l > hlo) subs.push(`M ${hlo} ${y1} H ${l}`);
        const r = Math.max(hlo, sx2);
        if (hhi > r) subs.push(`M ${r} ${y1} H ${hhi}`);
        const a = Math.max(hlo, sx1);
        const b = Math.min(hhi, sx2);
        if (b > a) {
          const dir = x1 < x2 ? 1 : -1;
          dustPts.push({ x: (dir > 0 ? a : b) - bx, y: y1 - by });
          dustPts.push({ x: (dir > 0 ? b : a) - bx, y: y1 - by });
        }
      }
      const vlo = Math.min(y1, y2);
      const vhi = Math.max(y1, y2);
      if (x2 < sx1 || x2 > sx2) {
        subs.push(`M ${x2} ${y1} V ${y2}`);
      } else {
        const t = Math.min(vhi, sy1);
        if (t > vlo) subs.push(`M ${x2} ${vlo} V ${t}`);
        const btm = Math.max(vlo, sy2);
        if (vhi > btm) subs.push(`M ${x2} ${btm} V ${vhi}`);
        const a = Math.max(vlo, sy1);
        const b = Math.min(vhi, sy2);
        if (b > a) {
          const dir = y1 < y2 ? 1 : -1;
          dustPts.push({ x: x2 - bx, y: (dir > 0 ? a : b) - by });
          dustPts.push({ x: x2 - bx, y: (dir > 0 ? b : a) - by });
        }
      }
      d = subs.join(" ");
    }
    setTrace({ d, dx: x2, dy: y2 });
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
