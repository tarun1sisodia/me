"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";
import {
  GUITAR_NOTES,
  guitarAudio,
  bowString,
  type StringGeometry,
} from "@/lib/guitar";

// The divider lines between the Process steps are guitar strings too:
// the top border of the steps plus one under each step, low to high
// top to bottom, so moving the mouse down the list plays an ascending
// run. A real string is fixed at both ends, so each line bows from
// the middle when plucked (see lib/guitar.ts).
export default function ProcessStrings() {
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
    const svg = svgRef.current;
    if (!svg) return;
    const steps = svg.closest(".steps") as HTMLElement | null;
    if (!steps) return;
    const s = state.current;

    const measure = () => {
      const rect = steps.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const tops = [0];
      steps.querySelectorAll<HTMLElement>(".step").forEach((el) => {
        tops.push(
          Math.round(el.getBoundingClientRect().bottom - rect.top)
        );
      });
      const paths = Array.from(
        svg.querySelectorAll<SVGPathElement>(".process-string")
      );
      s.centers = paths.map((_, i) => {
        const y = tops[i] ?? 0;
        s.geoms[i] = { horizontal: true, fixed: y, length: w };
        return y;
      });
      paths.forEach((el, i) => {
        const g = s.geoms[i];
        if (!g) return;
        el.setAttribute(
          "d",
          `M 0 ${g.fixed} Q ${(w / 2).toFixed(1)} ${g.fixed} ${w} ${g.fixed}`
        );
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(steps);
    window.addEventListener("resize", measure);

    const pluck = (i: number) => {
      const paths = svg.querySelectorAll<SVGPathElement>(".process-string");
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

    const nearest = (y: number) => {
      let best = 0;
      let bestD = Infinity;
      s.centers.forEach((c, i) => {
        const d = Math.abs(c - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const rect = steps.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y < 0 || y > rect.height) {
        s.lastString = -1;
        return;
      }
      const i = nearest(y);
      const now = performance.now();
      if (i !== s.lastString && now - s.lastPluck >= 40) pluck(i);
    };

    const onDown = (e: PointerEvent) => {
      guitarAudio.unlock();
      const rect = steps.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y < 0 || y > rect.height) return;
      pluck(nearest(y));
    };

    const onLeave = () => {
      s.lastString = -1;
    };

    steps.addEventListener("pointermove", onMove);
    steps.addEventListener("pointerdown", onDown);
    steps.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      steps.removeEventListener("pointermove", onMove);
      steps.removeEventListener("pointerdown", onDown);
      steps.removeEventListener("pointerleave", onLeave);
      s.cancels.forEach((cancel) => cancel());
    };
  }, [reduced]);

  return (
    <svg className="process-strings" ref={svgRef} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} className="process-string guitar-string" />
      ))}
    </svg>
  );
}
