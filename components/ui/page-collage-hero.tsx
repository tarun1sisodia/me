"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_TILES } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Original collage hero for main3: the five shipped project pages, captured
// as screenshots, fanned out like prints on a desk. Scrolling drifts them
// apart at different speeds while the headline lifts away. Inspired by the
// collage-hero idea in the reference Tarun sent — layout, type and motion
// are original to this site, and every tile is one of his own pages.

const PIN_VH = 3.2;

// Per-tile motion: base rotation, and how far it drifts while scrolling.
// Drift values are px on desktop, scaled down on narrow screens.
const TILE_MOTION: Record<string, { rot: number; x: number; y: number; rotEnd: number; scale: number }> = {
  arenaai: { rot: -1.5, x: 0, y: -40, rotEnd: -1, scale: 1.05 },
  cinematch: { rot: -4, x: -50, y: -110, rotEnd: -6, scale: 1 },
  freetune: { rot: 3.5, x: 50, y: -120, rotEnd: 5, scale: 1 },
  smartcampus: { rot: 2.5, x: -40, y: 70, rotEnd: 4, scale: 1 },
  bloodconnect: { rot: -3, x: 40, y: 80, rotEnd: -5, scale: 1 },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export default function PageCollageHero({ started = true }: { started?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  // Entry — gated on `started` (the Loader lifting), like the scrub hero.
  useEffect(() => {
    if (reduced || !started) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.from(headRef.current, { y: 40, opacity: 0, duration: 1 }, 0);
      HERO_TILES.forEach((tile, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        tl.from(
          el,
          { y: 90, opacity: 0, rotation: 0, scale: 0.92, duration: 1.1 },
          0.1 + i * 0.09
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, started]);

  // Scroll choreography — tall section + sticky stage, scrubbed.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      HERO_TILES.forEach((tile, i) => {
        const el = tileRefs.current[i];
        if (el) gsap.set(el, { rotation: TILE_MOTION[tile.id].rot });
      });

      const drift = () => (window.innerWidth < 768 ? 0.6 : 1);

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      master.to(
        headRef.current,
        { y: -120, opacity: 0.12, ease: "power1.inOut", duration: 1 },
        0
      );
      master.to(
        stageRef.current,
        { scale: 0.97, ease: "power1.inOut", duration: 1 },
        0
      );
      HERO_TILES.forEach((tile, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const m = TILE_MOTION[tile.id];
        master.to(
          el,
          {
            x: () => m.x * drift(),
            y: () => m.y * drift(),
            rotation: m.rotEnd,
            scale: m.scale,
            ease: "power1.inOut",
            duration: 1,
          },
          0
        );
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const tallHeight = `${PIN_VH * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className="collage-hero"
      style={{ height: tallHeight }}
      aria-label="Projects collage hero"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={headRef} className="collage-head">
          <p className="collage-kicker">Tarun Sisodia — Full-stack developer</p>
          <h1 className="collage-title">
            I build
            <br />
            <span className="collage-title-accent">real systems.</span>
          </h1>
          <p className="collage-sub">
            Five shipped projects. Click a page to step inside it.
          </p>
        </div>

        {HERO_TILES.map((tile, i) => (
          <div
            key={tile.id}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className={`collage-tile tile-${tile.id}`}
          >
            <a
              className="collage-card"
              href={tile.href}
              aria-label={`${tile.name} — ${tile.stack}, open project`}
            >
              <img src={tile.src} alt={tile.alt} draggable={false} loading={i < 2 ? "eager" : "lazy"} />
              <span className="collage-caption">
                <span className="collage-caption-name">{tile.name}</span>
                <span className="collage-caption-stack">{tile.stack}</span>
              </span>
            </a>
          </div>
        ))}

        <p className="collage-scroll" aria-hidden="true">
          Scroll <span>↓</span>
        </p>
      </div>
    </section>
  );
}
