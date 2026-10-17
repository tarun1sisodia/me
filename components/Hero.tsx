"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import Parallax from "./Parallax";
import Scramble from "./Scramble";
import Words from "./Words";
import { PROFILE } from "@/lib/data";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const AvatarStage = dynamic(() => import("./AvatarStage"), { ssr: false });

export default function Hero({ started }: { started: boolean }) {
  const [hasAvatar, setHasAvatar] = useState(false);

  useEffect(() => {
    fetch("/avatar.glb", { method: "HEAD" })
      .then((r) => {
        if (r.ok) setHasAvatar(true);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <ParticleField />
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-orb orb-a" aria-hidden="true" />
      <div className="hero-orb orb-b" aria-hidden="true" />
      <div className="container hero-inner">
        <Parallax speed={-0.14} className="hero-copy">
          <p className="hero-kicker">
            <span className="kicker-num">01</span>
            <span aria-hidden="true"> / </span>INTRO
          </p>
          <h1 className="hero-name">
            <Scramble text="TARUN SISODIA" active={started} />
          </h1>
          <Words text={PROFILE.subline} className="hero-sub" active={started} tag="p" />
          <Words
            text="I build production systems — APIs, payments, platforms. Full stack, security-minded, shipped not shelved."
            className="hero-desc"
            active={started}
            tag="p"
            delay={0.25}
          />
          <div className="hero-ctas">
            <Magnetic>
              <a href="#work" className="btn btn-primary">
                View work <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#connect" className="btn btn-ghost">
                Connect
              </a>
            </Magnetic>
          </div>
        </Parallax>
        <Parallax speed={-0.3} className="hero-photo">
          {hasAvatar ? (
            <AvatarStage
              className="hero-avatar"
              onError={() => setHasAvatar(false)}
            />
          ) : (
            <div className="duotone hero-frame">
              <Image
                src="/photos/hero-night-motion.png"
                alt="Tarun Sisodia at night, city crowd in motion behind him"
                fill
                sizes="(max-width: 900px) 82vw, 32vw"
                priority
              />
            </div>
          )}
          <p className="hero-caption">
            {hasAvatar ? "// me_3d — live render, tap to wave" : "// portrait_01 — night session"}
          </p>
        </Parallax>
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
