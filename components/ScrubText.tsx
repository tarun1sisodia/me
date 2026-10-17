"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrubText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const chars = el.querySelectorAll(".scrub-char");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");
  return (
    <p ref={ref} className={`scrub-text ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="scrub-word" aria-hidden="true">
          {w.split("").map((c, ci) => (
            <span key={ci} className="scrub-char">
              {c}
            </span>
          ))}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
