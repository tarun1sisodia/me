"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import Scramble from "./Scramble";
import { PROFILE } from "@/lib/data";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function Hero({ started }: { started: boolean }) {
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <ParticleField />
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-orb orb-a" aria-hidden="true" />
      <div className="hero-orb orb-b" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="kicker-num">01</span>
            <span aria-hidden="true"> / </span>INTRO
          </p>
          <h1 className="hero-name">
            <Scramble text="TARUN SISODIA" active={started} />
          </h1>
          <p className="hero-sub">{PROFILE.subline}</p>
          <p className="hero-desc">
            I build production systems — APIs, payments, platforms. Full stack,
            security-minded, shipped not shelved.
          </p>
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
        </div>
        <div className="hero-photo">
          <div className="duotone hero-frame">
            <Image
              src="/photos/hero-night-motion.png"
              alt="Tarun Sisodia at night, city crowd in motion behind him"
              fill
              sizes="(max-width: 900px) 82vw, 32vw"
              priority
            />
          </div>
          <p className="hero-caption">{"// portrait_01 — night session"}</p>
        </div>
      </div>
      <a href="#stack" className="scroll-hint" aria-label="Scroll to content">
        <ArrowDown size={15} aria-hidden="true" />
        <span>scroll</span>
      </a>
    </section>
  );
}
