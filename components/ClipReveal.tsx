"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ClipReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0% round 18px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 18px)",
          ease: "power3.inOut",
          duration: 1.15,
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
      const inner = el.firstElementChild;
      if (inner) {
        gsap.fromTo(
          inner,
          { scale: 1.22 },
          {
            scale: 1,
            ease: "power3.out",
            duration: 1.5,
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`clip-reveal ${className}`}>
      {children}
    </div>
  );
}
