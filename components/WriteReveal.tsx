"use client";
import { useEffect, useRef, type CSSProperties } from "react";

export default function WriteReveal({
  text,
  active,
  className = "",
  delay = 0,
}: {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const t = requestAnimationFrame(() => el.classList.add("is-writing"));
    return () => cancelAnimationFrame(t);
  }, [active]);

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
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
