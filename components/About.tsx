"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import DotWave from "./DotWave";
import { ABOUT_STORY } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// THE PERSON, rebuilt at Tarun's ask: no big photos, just centred text.
// The story reads itself as you scroll (words light up one by one, like
// reading), and hovering a line shows the photo behind it as a floating
// preview that follows the cursor. One photo per line.
const READ_IMAGES = [
  "/photos/portrait-smiling-arms-crossed.jpg",
  "/photos/workspace-me-coding-cafe.png",
  "/photos/tarun-corridor-bw.jpg",
];

// Words that light up in the accent (burnt orange) instead of the plain
// text colour — the ones that carry the story.
const ACCENT_WORDS = new Set([
  "developer",
  "backends",
  "money",
  "users",
  "security",
]);

export default function About() {
  const readRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [hoverSrc, setHoverSrc] = useState<string | null>(null);

  // Preload the hover photos so the first hover shows instantly.
  useEffect(() => {
    READ_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Scroll highlight — the words start dim and light up one by one as
  // the block moves through the viewport, like reading. Reduced motion
  // skips it entirely (all words stay fully lit).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = readRef.current;
    if (!root) return;
    const words = root.querySelectorAll(".about-word");
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.16 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.4,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Floating preview — follows the cursor (fine pointers only) and fades
  // in/out with the hovered line. GSAP owns the whole transform, so the
  // show/hide (opacity + scale) and the follow (x + y) never fight.
  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(el, { scale: 0.92, rotation: -3 });
    const fx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const fy = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      fx(e.clientX + 28);
      fy(e.clientY - 110);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: hoverSrc ? 1 : 0,
      scale: hoverSrc ? 1 : 0.92,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [hoverSrc]);

  return (
    <section className="section about about-center" id="about" aria-label="About">
      <div className="container">
        <SectionHeading
          index="02"
          label="THE PERSON"
          kicker="THE HUMAN BEHIND THE SYSTEMS"
          title="Not a template person."
          blurb="The short version of a long story with computers."
        />
        <div
          className="about-read"
          ref={readRef}
          onMouseLeave={() => setHoverSrc(null)}
        >
          {ABOUT_STORY.map((line, i) => (
            <p
              key={i}
              className="about-read-line"
              onMouseEnter={() => setHoverSrc(READ_IMAGES[i])}
            >
              {line.split(" ").map((word, j) => {
                const clean = word.replace(/[.,—]/g, "").toLowerCase();
                const accent = ACCENT_WORDS.has(clean);
                return (
                  <span
                    key={j}
                    className={accent ? "about-word about-word-accent" : "about-word"}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
        <div ref={floatRef} className="about-float" aria-hidden="true">
          <img src={hoverSrc ?? READ_IMAGES[0]} alt="" draggable={false} />
        </div>
        <DotWave />
      </div>
    </section>
  );
}
