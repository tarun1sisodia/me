"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_PORTRAIT, HERO_TILES } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// main3 hero — the full sequence, rebuilt from the motion structure of the
// reference Tarun sent (a pinned portrait hero that zooms, shrinks into a
// card, uncovers a screenshot grid behind it, then wipes out). Everything
// on screen is Tarun's own: his portrait, his headline, his project
// screenshots. The reference's photo, name and copy are not used, and its
// layout is reworked for his content and palette (burnt orange on black).
//
// Sequence (one scrubbed timeline over a 2.7-viewport section):
//   0.00–0.14  portrait zooms into the face, passing in front of the
//              headline; the Get in touch pill fades out.
//   0.14–0.34  the whole panel shrinks into a centred rounded card.
//   0.34–0.82  the card settles small while the screenshot grid behind
//              it drifts slowly upward.
//   0.82–0.94  the card slides up out of view.
//   0.88–1.00  a curved orange panel wipes up over the stage.
// Scrolling back replays it all in reverse. Reduced motion gets a static
// intro panel with the grid below it instead.

const PIN_VH = 2.7;

// The grid shows each project twice (second copy reversed, so no two
// neighbours in a column repeat) and drifts up as you scroll.
const GRID_TILES = [...HERO_TILES, ...[...HERO_TILES].reverse()];

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

function GridTiles() {
  return (
    <>
      {GRID_TILES.map((tile, i) => (
        <div key={`${tile.id}-${i}`} className="m3-tile">
          <a
            className="m3-card"
            href={tile.href}
            aria-label={`${tile.name} — ${tile.stack}, open project`}
          >
            <img src={tile.src} alt={tile.alt} draggable={false} loading="lazy" />
            <span className="m3-caption">
              <span className="m3-caption-name">{tile.name}</span>
              <span className="m3-caption-stack">{tile.stack}</span>
            </span>
          </a>
        </div>
      ))}
    </>
  );
}

export default function PageCollageHero({ started = true }: { started?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Entry — gated on `started` (the Loader lifting): portrait rises from
  // below, headline lines slide in, pill and labels fade in.
  useEffect(() => {
    if (reduced || !started) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.from(portraitRef.current, { yPercent: 16, opacity: 0, duration: 1.1 }, 0);
      tl.from(
        section.querySelectorAll(".m3-title-line"),
        { y: 70, opacity: 0, duration: 1, stagger: 0.09 },
        0.1
      );
      tl.from(section.querySelectorAll(".m3-kicker, .m3-pill, .m3-label"), {
        y: 12,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
      }, 0.25);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, started]);

  // Scroll choreography — tall section + sticky stage, scrubbed.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(wipeRef.current, { yPercent: 100 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Zoom into the face; the pill leaves with the first scroll.
      master.to(
        portraitRef.current,
        { scale: 1.8, xPercent: -6, transformOrigin: "70% 18%", duration: 0.14 },
        0
      );
      master.to(pillRef.current, { opacity: 0, y: -12, duration: 0.1 }, 0);

      // The whole panel shrinks into a centred rounded card.
      master.to(
        panelRef.current,
        { scale: 0.52, borderRadius: 28, duration: 0.2 },
        0.14
      );

      // The card settles small; the grid drifts up behind it.
      master.to(panelRef.current, { scale: 0.48, duration: 0.16 }, 0.34);
      master.to(
        gridRef.current,
        { y: () => -window.innerHeight * 0.26, duration: 0.48 },
        0.34
      );

      // The card slides up out; the curved panel wipes in after it.
      master.to(
        panelRef.current,
        { yPercent: -160, scale: 0.38, duration: 0.12 },
        0.82
      );
      master.to(wipeRef.current, { yPercent: 0, duration: 0.12 }, 0.88);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  // Mouse parallax — the portrait drifts with the cursor like a physical
  // object (the headline counter-moves slightly for depth). This is the
  // piece the reference's hero has that the first rebuild missed: its
  // portrait moves with the mouse, not just with scroll. Fine pointers
  // only, never with reduced motion. The offsets are small on purpose
  // (±14px portrait, ∓7px headline); the scroll zoom/scale live on
  // separate transform components (scale, xPercent), so nothing fights.
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    const portrait = portraitRef.current;
    const head = headRef.current;
    if (!stage || !portrait || !head) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const px = gsap.quickTo(portrait, "x", { duration: 0.7, ease: "power3" });
    const py = gsap.quickTo(portrait, "y", { duration: 0.7, ease: "power3" });
    const pr = gsap.quickTo(portrait, "rotation", { duration: 0.9, ease: "power3" });
    const hx = gsap.quickTo(head, "x", { duration: 0.7, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;
      px(nx * 28);
      py(ny * 20);
      pr(nx * 1.6);
      hx(nx * -14);
    };
    const onLeave = () => {
      px(0);
      py(0);
      pr(0);
      hx(0);
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const tallHeight = `${PIN_VH * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className="m3-hero"
      style={{ height: reduced ? undefined : tallHeight }}
      aria-label="Intro hero"
    >
      <div
        ref={stageRef}
        className={reduced ? "m3-stage-static" : "m3-stage"}
      >
        {!reduced && (
          <div ref={gridRef} className="m3-grid">
            <GridTiles />
          </div>
        )}

        <div ref={panelRef} className="m3-panel">
          <div ref={portraitRef} className="m3-portrait" aria-hidden="true">
            <img src={HERO_PORTRAIT} alt="" draggable={false} fetchPriority="high" />
            <span className="m3-portrait-grade" />
          </div>

          <div ref={headRef} className="m3-head">
            <p className="m3-kicker">Tarun Sisodia — Full-stack developer</p>
            <h1 className="m3-title">
              <span className="m3-title-line">I build</span>
              <span className="m3-title-line">real systems.</span>
            </h1>
          </div>

          <a ref={pillRef} className="m3-pill" href="#connect">
            <i aria-hidden="true" />
            Get in touch
          </a>

          <p className="m3-label m3-label-a">Five shipped projects</p>
          <p className="m3-label m3-label-b">Full-stack developer</p>
        </div>

        {!reduced && <div ref={wipeRef} className="m3-wipe" aria-hidden="true" />}
      </div>

      {reduced && (
        <div className="m3-grid-static">
          <GridTiles />
        </div>
      )}
    </section>
  );
}
