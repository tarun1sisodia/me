"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion, useScramble } from "@/lib/hooks";

export default function Scramble({
  text,
  active,
  className = "",
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const scramble = useScramble(active, reduced);

  useEffect(() => {
    scramble(ref.current, text);
  }, [scramble, text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
