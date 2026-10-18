"use client";
import { useEffect, useRef, type CSSProperties } from "react";

export default function WriteReveal({
  text,
  active,
  className = "",
  delay = 0,
  colorFill = false,
}: {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
  colorFill?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const t = requestAnimationFrame(() => {
      el.classList.add("is-writing");
      if (
        colorFill &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        el.classList.add("is-colored");
      }
    });
    return () => cancelAnimationFrame(t);
  }, [active, colorFill]);

  const onEnd = (i: number, target: HTMLElement) => {
    target.classList.add("is-written");
    if (colorFill && i === text.length - 1) {
      const parent = target.closest(".write-reveal");
      window.setTimeout(() => parent?.classList.add("is-colored"), 350);
    }
  };

  return (
    <span
      ref={ref}
      className={`write-reveal ${className}`}
      style={{ "--wdelay": `${delay}s` } as CSSProperties}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="write-char"
          style={{ "--i": i } as CSSProperties}
          aria-hidden="true"
          onAnimationEnd={(e) => onEnd(i, e.currentTarget)}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
