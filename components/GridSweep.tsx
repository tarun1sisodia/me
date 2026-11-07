"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import {
  GUITAR_NOTES,
  guitarAudio,
  bowString,
  type StringGeometry,
} from "@/lib/guitar";

// The 14 background lines are guitar strings: E minor pentatonic,
// low to high left to right, so a strum either way always sounds good.
// A real string is fixed at both ends, so each one bows from the middle
// when plucked (see lib/guitar.ts).
export default function GridSweep({ lines = 14 }: { lines?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const state = useRef({
    centers: [] as number[],
    geoms: [] as StringGeometry[],
    lastString: -1,
    lastPluck: 0,
    cancels: new Map<SVGPathElement, () => void>(),
  });

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const section = root.closest(".interlude") as HTMLElement | null;
    if (!section) return;
    const s = state.current;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const secLeft = section.getBoundingClientRect().left;
      const paths = Array.from(
        svg.querySelectorAll<SVGPathElement>(".gridsweep-line")
      );
      s.centers = paths.map((el, i) => {
        const x = Math.round(((i + 0.5) / paths.length) * w);
        s.geoms[i] = { horizontal: false, fixed: x, length: h };
        return x + rect.left - secLeft;
      });
      paths.forEach((el, i) => {
        const g = s.geoms[i];
        el.setAttribute(
          "d",
          `M ${g.fixed} 0 Q ${g.fixed} ${(h / 2).toFixed(1)} ${g.fixed} ${h}`
        );
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const pluck = (i: number) => {
      const paths = svg.querySelectorAll<SVGPathElement>(".gridsweep-line");
      const el = paths[i];
      const g = s.geoms[i];
      if (!el || !g) return;
      s.lastString = i;
      s.lastPluck = performance.now();
      guitarAudio.play(GUITAR_NOTES[i % GUITAR_NOTES.length]);
      const prev = s.cancels.get(el);
      if (prev) prev();
      s.cancels.set(el, bowString(el, g));
    };

    const nearest = (x: number) => {
      let best = 0;
      let bestD = Infinity;
      s.centers.forEach((c, i) => {
        const d = Math.abs(c - x);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 0 || x > rect.width) {
        s.lastString = -1;
        return;
      }
      const i = nearest(x);
      const now = performance.now();
      if (i !== s.lastString && now - s.lastPluck >= 40) pluck(i);
    };

    const onDown = (e: PointerEvent) => {
      guitarAudio.unlock();
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 0 || x > rect.width) return;
      pluck(nearest(x));
    };

    const onLeave = () => {
      s.lastString = -1;
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", measure);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointerleave", onLeave);
      s.cancels.forEach((cancel) => cancel());
    };
  }, [reduced, lines]);

  return (
    <div className="gridsweep" aria-hidden="true" ref={ref}>
      <svg className="gridsweep-svg" ref={svgRef} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <path key={i} className="gridsweep-line guitar-string" />
        ))}
      </svg>
      <span className="gridsweep-band" />
    </div>
  );
}
