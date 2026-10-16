"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import { JOURNEY } from "@/lib/data";

export default function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (progressRef.current) progressRef.current.style.transform = "scaleY(1)";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-list",
            start: "top 72%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section journey" id="journey" ref={rootRef} aria-label="Journey">
      <div className="container">
        <SectionHeading
          num="02"
          label="JOURNEY"
          title="The road so far."
          blurb="Degrees, internships, and production systems — in order."
        />
        <div className="journey-grid">
          <div className="journey-visual">
            <Parallax speed={-0.12}>
              <Reveal>
                <div className="duotone journey-frame">
                  <Image
                    src="/photos/photo-bw-double-exposure.png"
                    alt="Artistic double-exposure portrait of Tarun Sisodia"
                    fill
                    sizes="(max-width: 900px) 88vw, 30vw"
                  />
                </div>
                <p className="journey-visual-cap">{"// every version of me, layered"}</p>
              </Reveal>
            </Parallax>
          </div>
          <div className="journey-list">
            <div className="journey-line" aria-hidden="true">
              <div className="journey-progress" ref={progressRef} />
            </div>
            {JOURNEY.map((j) => (
              <Reveal key={j.title}>
                <article className={`journey-item${j.current ? " is-current" : ""}`}>
                  <span className="journey-dot" aria-hidden="true" />
                  <p className="journey-period">{j.period}</p>
                  <h3 className="journey-title">{j.title}</h3>
                  <p className="journey-org">{j.org}</p>
                  <p className="journey-detail">{j.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
