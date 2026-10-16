"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SplitReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const chars = el.querySelectorAll(".split-char");
    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 115, rotate: 4 });
      gsap.to(chars, {
        yPercent: 0,
        rotate: 0,
        duration: 0.75,
        ease: "power4.out",
        stagger: 0.016,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");
  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="split-mask" aria-hidden="true">
          {w.split("").map((c, ci) => (
            <span key={ci} className="split-char">
              {c}
            </span>
          ))}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
