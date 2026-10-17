"use client";
import { useCallback, useRef, type MouseEvent } from "react";
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

export default function OrbitWords() {
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dustRef = useRef<{ x: number; y: number } | null>(null);

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
    dustRef.current = null;
    if (!word || !stage || !letterEl || !sticker) return;
    const sr = stage.getBoundingClientRect();
    const wr = word.getBoundingClientRect();
    const lr = (letterEl as HTMLElement).getBoundingClientRect();
    const br = sticker.getBoundingClientRect();
    const bx = br.left - sr.left;
    const by = br.top - sr.top;
    const x1 = wr.left - sr.left + wr.width / 2;
    const y1 = wr.top - sr.top + wr.height / 2;
    const x2 = lr.left - sr.left + lr.width / 2;
    const y2 = lr.top - sr.top + 4;
    const solid = (x: number, y: number) =>
      maskReady()
        ? solidAt((x - bx) / br.width, (y - by) / br.height)
        : x >= bx && x <= bx + br.width && y >= by && y <= by + br.height;
    const find = (ax: number, ay: number, bx2: number, by2: number) => {
      const len = Math.hypot(bx2 - ax, by2 - ay);
      const n = Math.max(2, Math.ceil(len / 5));
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const x = ax + (bx2 - ax) * t;
        const y = ay + (by2 - ay) * t;
        if (solid(x, y)) return { x: x - bx, y: y - by };
      }
      return null;
    };
    dustRef.current = find(x1, y1, x2, y1) ?? find(x2, y1, x2, y2);
  }, []);

  const highlight = (letter: string | null) => {
    window.dispatchEvent(new CustomEvent("name:highlight", { detail: letter }));
  };

  const onEnter = (i: number) => {
    measure(i);
    highlight(WORDS[i].letter);
    if (dustRef.current) {
      window.dispatchEvent(
        new CustomEvent("portrait:dust", { detail: dustRef.current })
      );
    }
  };

  const clearHover = () => {
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
  );
}
