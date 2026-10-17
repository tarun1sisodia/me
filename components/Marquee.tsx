"use client";
import { useEffect, useRef } from "react";
import { MARQUEE_ITEMS } from "@/lib/data";

export default function Marquee({
  items = MARQUEE_ITEMS,
  baseSpeed = 1.4,
  reverse = false,
  separator = "✦",
  className = "",
  id,
}: {
  items?: string[];
  baseSpeed?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  id?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let vel = 0;
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      vel += (y - lastY) * 0.045;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const dir = reverse ? -1 : 1;
    const loop = () => {
      vel *= 0.93;
      const boost = Math.min(Math.abs(vel), 14);
      x -= dir * (baseSpeed + boost);
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      const skew = Math.max(-10, Math.min(10, -vel * 0.55 * dir));
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [baseSpeed, reverse]);

  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className={`marquee ${className}`} id={id} aria-hidden="true">
      <div ref={trackRef} className="marquee-track marquee-track-js">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-sep">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
