"use client";
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

type Word = {
  w: string;
  tech: string;
  left?: string;
  right?: string;
  top: string;
  c: string;
  d: string;
  dl: string;
};

const WORDS: Word[] = [
  { w: "typescript", tech: "TypeScript", left: "7%", top: "16%", c: "", d: "6s", dl: "0s" },
  { w: "fastapi", tech: "FastAPI", right: "8%", top: "22%", c: "c-cyan", d: "7.5s", dl: "-2s" },
  { w: "docker", tech: "Docker", left: "11%", top: "60%", c: "c-cyan", d: "8s", dl: "-4s" },
  { w: "postgresql", tech: "PostgreSQL", right: "10%", top: "56%", c: "", d: "6.8s", dl: "-1s" },
  { w: "react", tech: "React", left: "21%", top: "6%", c: "c-white", d: "7.2s", dl: "-3s" },
  { w: "security", tech: "Security", right: "21%", top: "8%", c: "", d: "8.4s", dl: "-5s" },
  { w: "redis", tech: "Redis", left: "15%", top: "84%", c: "", d: "7.8s", dl: "-2.5s" },
  { w: "ship it", tech: "", right: "16%", top: "82%", c: "c-cyan", d: "6.4s", dl: "-0.8s" },
];

type Line = { x1: number; y1: number; x2: number; y2: number; len: number };

export default function OrbitWords() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [line, setLine] = useState<Line | null>(null);
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const measure = useCallback((i: number) => {
    const word = wordRefs.current[i];
    const stage = word?.closest(".hero-stage");
    const sticker = stage?.querySelector(".hero-sticker");
    if (!word || !stage || !sticker) return;
    const sr = stage.getBoundingClientRect();
    const wr = word.getBoundingClientRect();
    const tr = sticker.getBoundingClientRect();
    const x1 = wr.left - sr.left + wr.width / 2;
    const y1 = wr.top - sr.top + wr.height / 2;
    const x2 = tr.left - sr.left + tr.width / 2;
    const y2 = tr.top - sr.top + tr.height * 0.42;
    setLine({ x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) });
  }, []);

  const onEnter = (i: number) => {
    measure(i);
    setHovered(i);
  };

  const onLeave = () => {
    setHovered(null);
    setLine(null);
  };

  const onClick = (e: MouseEvent, tech: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("work:filter", { detail: tech }));
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {hovered !== null && line && (
        <svg className="orbit-lines" aria-hidden="true" key={hovered}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="orbit-line"
            style={{ "--len": line.len } as CSSProperties}
          />
          <circle cx={line.x2} cy={line.y2} r="3.5" className="orbit-dot" />
        </svg>
      )}
      <div className="orbit-words" aria-hidden="false">
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
