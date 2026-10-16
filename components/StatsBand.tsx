"use client";
import { STATS } from "@/lib/data";
import { useCountUp, useInView, useReducedMotion } from "@/lib/hooks";

function Stat({
  value,
  suffix,
  label,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const reduced = useReducedMotion();
  const n = useCountUp(value, start);
  return (
    <div className="stat">
      <span className="stat-num">
        {reduced ? value : n}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function StatsBand() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  return (
    <section className="stats" aria-label="Highlights">
      <div ref={ref} className="container stats-grid">
        {STATS.map((s) => (
          <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} start={inView} />
        ))}
      </div>
    </section>
  );
}
