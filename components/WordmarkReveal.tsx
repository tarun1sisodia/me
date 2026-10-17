"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const LETTERS = [
  { ch: "T", img: "/photos/portrait-studio-clean.jpg" },
  { ch: "A", img: "/photos/portrait-smiling-arms-crossed.jpg" },
  { ch: "R", img: "/photos/photo-bw-double-exposure.png" },
  { ch: "U", img: "/photos/workspace-me-coding-cafe.png" },
  { ch: "N", img: "/photos/hero-night-motion.png" },
];

export default function WordmarkReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const float = floatRef.current;
    if (!root || !float) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const imgs = Array.from(float.querySelectorAll(".wm-img"));
    gsap.set(float, { scale: 0, xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(float, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(float, "y", { duration: 0.55, ease: "power3" });
    const rTo = gsap.quickTo(float, "rotation", { duration: 0.7, ease: "power3" });

    let active = false;
    const show = (i: number, e: MouseEvent) => {
      active = true;
      imgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(float, {
        scale: 1,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
    };
    const hide = () => {
      active = false;
      gsap.to(float, {
        scale: 0,
        duration: 0.35,
        ease: "expo.out",
        overwrite: "auto",
      });
    };
    const onMove = (e: MouseEvent) => {
      if (!active) return;
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-10, 10, (e.movementX || 0) * 0.5));
    };

    const letters = Array.from(root.querySelectorAll(".wm-letter"));
    const offs = letters.map((el, i) => {
      const h = (e: Event) => show(i, e as MouseEvent);
      el.addEventListener("mouseenter", h);
      return () => el.removeEventListener("mouseenter", h);
    });
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", hide);
    return () => {
      offs.forEach((off) => off());
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="foot-mark wm" aria-label="Tarun">
        {LETTERS.map((l, i) => (
          <span key={i} className="wm-letter" aria-hidden="true">
            {l.ch}
          </span>
        ))}
      </div>
      <div ref={floatRef} className="wm-float" aria-hidden="true">
        {LETTERS.map((l, i) => (
          <div key={i} className="wm-img">
            <Image src={l.img} alt="" width={480} height={360} />
          </div>
        ))}
      </div>
    </>
  );
}
