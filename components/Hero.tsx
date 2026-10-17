"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import WriteReveal from "./WriteReveal";
import OrbitWords from "./OrbitWords";

const AvatarStage = dynamic(() => import("./AvatarStage"), { ssr: false });

export default function Hero({ started }: { started: boolean }) {
  const [hasAvatar, setHasAvatar] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/avatar.glb", { method: "HEAD" })
      .then((r) => {
        if (r.ok) setHasAvatar(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      sec.style.setProperty("--mx", x.toFixed(3));
      sec.style.setProperty("--my", y.toFixed(3));
    };
    sec.addEventListener("mousemove", onMove, { passive: true });
    return () => sec.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const onHighlight = (e: Event) => {
      const letter = (e as CustomEvent<string | null>).detail;
      sec
        .querySelectorAll(".write-reveal.name-tarun .write-char")
        .forEach((el) => {
          el.classList.toggle(
            "char-lit",
            !!letter && el.textContent?.toUpperCase() === letter
          );
        });
    };
    window.addEventListener("name:highlight", onHighlight);
    return () => window.removeEventListener("name:highlight", onHighlight);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero bg-blueprint-anim"
      id="top"
      aria-label="Introduction"
    >
      <div className="hero-noise" aria-hidden="true" />
      <div className="container hero-top">
        <span className="chapter-label">
          <span className="chapter-bullet" aria-hidden="true" />
          01 / PRESENCE
        </span>
        <span className="chapter-kicker">FULL STACK · SECURITY-MINDED</span>
      </div>

      <div className="container hero-stage">
        <OrbitWords />
        <div className="hero-sticker" data-cursor="HI">
          {hasAvatar ? (
            <AvatarStage
              className="hero-avatar"
              onError={() => setHasAvatar(false)}
            />
          ) : (
            <>
              <Image
                src="/photos/sticker-tarun-halftone.png"
                alt="Tarun Sisodia — halftone portrait"
                className="sticker-ht"
                width={1254}
                height={1324}
                priority
              />
              <Image
                src="/photos/sticker-tarun.png"
                alt=""
                aria-hidden="true"
                className="sticker-color"
                width={1254}
                height={1324}
              />
            </>
          )}
        </div>
        <h1 className="hero-giant">
          <WriteReveal text="TARUN" active={started} className="name-tarun" />
          <br />
          <WriteReveal text="SISODIA" active={started} delay={1.1} />
        </h1>
        <p className="hero-mono-caption">A BUILDER'S PERSPECTIVE ON SYSTEMS</p>
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <span>SCROLL TO DISCOVER ↓</span>
        <span>BUILDING SINCE 2022</span>
        <span>OPEN FOR WORK ◆ FULL STACK ◆ SHIPPED NOT SHELVED</span>
      </div>

      <a href="#stack" className="scroll-badge" aria-label="Scroll to content">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="scroll-badge-ring">
          <defs>
            <path
              id="badge-circle"
              d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
            />
          </defs>
          <text className="scroll-badge-text">
            <textPath href="#badge-circle">
              OPEN FOR WORK • SCROLL DOWN • OPEN FOR WORK • SCROLL DOWN •
            </textPath>
          </text>
        </svg>
        <ArrowDown size={16} aria-hidden="true" className="scroll-badge-arrow" />
      </a>
    </section>
  );
}
