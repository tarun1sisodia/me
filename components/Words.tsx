"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Words({
  text,
  className = "",
  active,
  tag = "p",
  stagger = 0.055,
  delay = 0,
}: {
  text: string;
  className?: string;
  active?: boolean;
  tag?: "p" | "span";
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const words = el.querySelectorAll(".w-word");
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115 });
      const vars = {
        yPercent: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger,
        delay,
      };
      if (active === undefined) {
        gsap.to(words, {
          ...vars,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      } else if (active) {
        gsap.to(words, vars);
      }
    }, el);
    return () => ctx.revert();
  }, [active, stagger, delay, text]);

  const parts = text.split(" ");
  const inner = parts.map((w, i) => (
    <span key={i} className="w-mask" aria-hidden="true">
      <span className="w-word">{w}</span>
      {i < parts.length - 1 ? " " : ""}
    </span>
  ));

  if (tag === "span") {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={className} aria-label={text}>
        {inner}
      </span>
    );
  }
  return (
    <p ref={ref as React.RefObject<HTMLParagraphElement>} className={className} aria-label={text}>
      {inner}
    </p>
  );
}
