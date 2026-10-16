"use client";
import type { ReactNode } from "react";
import { useMagnetic, useReducedMotion } from "@/lib/hooks";

export default function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useMagnetic<HTMLDivElement>(strength, reduced);
  return (
    <div ref={ref} data-magnetic className={`magnetic ${className}`}>
      {children}
    </div>
  );
}
