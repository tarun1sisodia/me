"use client";
import { useEffect, useState } from "react";

export default function MotionToggle() {
  const [off, setOff] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("motion-off") === "1";
    const prefers = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const initial = saved || prefers;
    setOff(initial);
    document.documentElement.classList.toggle("motion-off", initial);
  }, []);

  const toggle = () => {
    const next = !off;
    setOff(next);
    document.documentElement.classList.toggle("motion-off", next);
    localStorage.setItem("motion-off", next ? "1" : "0");
  };

  return (
    <button
      className="motion-toggle"
      onClick={toggle}
      aria-pressed={off}
      aria-label={off ? "Turn animations on" : "Turn animations off"}
    >
      <span className="motion-toggle-bars" aria-hidden="true">
        <span />
        <span />
      </span>
      MOTION {off ? "OFF" : "ON"}
    </button>
  );
}
