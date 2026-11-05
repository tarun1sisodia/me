"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectPoints({ points }: { points: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-4xl bg-black/45 px-6 py-16 backdrop-blur-[2px] sm:py-24"
    >
      <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[#ff6b35]">
        In short
      </p>
      <ul className="space-y-6">
        {points.slice(0, 3).map((point, i) => (
          <li
            key={i}
            className={`flex gap-4 text-xl leading-snug text-[#f5f5f5] transition-all duration-700 ease-out sm:text-2xl ${
              inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 140}ms` }}
          >
            <span
              className="mt-3 h-2 w-2 flex-none rounded-full bg-[#ff6b35]"
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
