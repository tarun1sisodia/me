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
// Sequence (one scrubbed timeline over a 3.55-viewport section), after a
// sequenced entry: the text comes in first and slow (kicker, then the
// title lines rising in), and only once the text has appeared is the
// portrait uncovered top-down by a clip-path reveal.
//   0.00–0.14  portrait zooms into the face, passing in front of the
//              headline; the Get in touch pill fades out.
//   0.14–0.34  the whole panel shrinks into a centred rounded card.
//   0.34–0.82  the card settles small while the screenshot grid behind
//              it drifts slowly upward.
//   0.82–0.94  the card slides up out of view.
//   0.88–1.00  a curved orange panel wipes up over the stage; its content
//              (Selected Work title, project list, feature card) fades in
//              only once the panel has filled the stage.
//   1.00–1.50  the wipe stays on screen while scrolling cycles through
//              the five projects, like the reference's Award Winning Work:
//              the filled dot moves down the list and the feature card
//              swaps to that project's image and one-liner. The steps are
//              driven by the ScrollTrigger's progress (see onUpdate), not
//              by timeline tweens, so scrolling back reverses them cleanly.
//   Mouse: the portrait slides opposite the cursor (mouse right → figure
//   left), ±14px at the extremes (28px across the full mouse travel),
//   the headline ±7px, the labels ±6px, no tilt — the reference moves
//   about 52px across, and Tarun asked for it clearly bigger after the
//   old ±7px felt too minor. The headline drifts the same way at half
//   strength, the labels a little less. The portrait is a real cutout,
//   centred, with the big headline behind him — the type spans past the
//   figure on both sides, so the words read around him.
// Scrolling back replays it all in reverse. Reduced motion gets a static
// intro panel with the grid below it instead.

const PIN_VH = 3.55;

// Timeline positions (of 1.50 total) where the wipe steps to the next
// project. In ScrollTrigger progress (position / 1.50): 0.68, 0.76, 0.84,
// 0.92 — ArenaAI is the initial state, so four steps cover the other four.
const WIPE_STEP_PROGRESS = [0.68, 0.76, 0.84, 0.92];

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
  const wipeContentRef = useRef<HTMLDivElement>(null);
  // Which project the wipe's list + feature card currently show (0–4).
  // Driven by the scroll timeline's progress; scrolling back reverses it.
  const [wipeActive, setWipeActive] = useState(0);
  const wipeActiveRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  // Entry — gated on `started` (the Loader lifting), and sequenced:
  // the TEXT appears first, slow, and only once it has appeared does the
  // IMAGE come in, with a reveal. The kicker fades up, the title lines
  // rise in slowly (1.3s each), the pill and labels fade in with them —
  // then the portrait is uncovered top-down by a clip-path wipe, like
  // being unveiled (the head appears first, then the shoulders and body).
  // The reveal owns only clip-path, so it never fights the scroll
  // timeline, which owns the portrait's scale and position.
  useEffect(() => {
    if (reduced || !started) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
      // The text first, slow.
      tl.from(section.querySelectorAll(".m3-kicker"), {
        y: 12,
        opacity: 0,
        duration: 0.9,
      }, 0);
      tl.from(
        section.querySelectorAll(".m3-title-line"),
        { y: 70, opacity: 0, duration: 1.3, stagger: 0.1 },
        0.15
      );
      tl.from(section.querySelectorAll(".m3-pill, .m3-label"), {
        y: 12,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
      }, 0.5);
      // Then the image, revealed top-down once the text has appeared
      // (the title's second line finishes at ~1.55s).
      tl.fromTo(
        portraitRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" },
        1.6
      );
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
      gsap.set(wipeContentRef.current, { opacity: 0 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          // The wipe steps: as the timeline's progress crosses each
          // threshold, the list's filled dot moves and the feature card
          // swaps to that project. Guarded by a ref so React only
          // re-renders when the active project actually changes.
          onUpdate: (self) => {
            const p = self.progress;
            let next = 0;
            for (let i = 0; i < WIPE_STEP_PROGRESS.length; i++) {
              if (p >= WIPE_STEP_PROGRESS[i]) next = i + 1;
            }
            if (next !== wipeActiveRef.current) {
              wipeActiveRef.current = next;
              setWipeActive(next);
            }
          },
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

      // The whole panel shrinks into a centred rounded card. While it
      // shrinks, the portrait zooms further and re-centres, so the face
      // fills the card like the reference's card (a tight face crop, not
      // the whole figure shrunk small). Face sits near (74%, 25%) of the
      // panel; the shifts below land it centred-right in the card.
      master.to(
        panelRef.current,
        { scale: 0.52, borderRadius: 28, duration: 0.2 },
        0.14
      );
      master.to(
        portraitRef.current,
        { scale: 2.5, xPercent: -1, yPercent: 4, duration: 0.2 },
        0.14
      );

      // The card settles small; the grid drifts up behind it.
      master.to(panelRef.current, { scale: 0.48, duration: 0.16 }, 0.34);
      master.to(
        gridRef.current,
        { yPercent: -15.3, duration: 0.48 },
        0.34
      );

      // The card slides up out; the curved panel wipes in after it.
      master.to(
        panelRef.current,
        { yPercent: -160, scale: 0.38, duration: 0.12 },
        0.82
      );
      master.to(wipeRef.current, { yPercent: 0, duration: 0.12 }, 0.88);

      // The wipe's content stays invisible while the panel rises and only
      // fades in once it has filled the stage (like the reference, where
      // the heading appears after the wipe settles).
      master.to(wipeContentRef.current, { opacity: 1, duration: 0.04 }, 0.96);

      // Hold the wipe on screen for the five project steps (1.00–1.50).
      // A duration-only tween: it changes nothing, it just gives the
      // steps scroll room. The steps themselves are driven by the
      // ScrollTrigger's onUpdate above.
      master.to(wipeRef.current, { duration: 0.5 }, 1.0);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  // Auto background — the collage grid behind the hero drifts slowly on
  // its own, even when the user is not scrolling (Tarun asked for an
  // auto-moving background). It animates the grid's `y` while the scrub
  // timeline owns `yPercent`, so the two never fight.
  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    if (!grid) return;
    const drift = gsap.to(grid, {
      y: -70,
      duration: 12,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      drift.kill();
    };
  }, [reduced]);

  // Mouse parallax — measured from the reference, not guessed. Its
  // portrait slides OPPOSITE to the cursor (mouse right/down → portrait
  // left/up), about 52px total across the full mouse travel, with no
  // tilt, no rotation and no scale change — a slow, lazy drift that takes
  // a second or two to settle. The headline drifts the same way at about
  // half strength, the side labels a little less. The earlier version had
  // this backwards (portrait following the mouse, plus a tilt the
  // reference never does). Fine pointers only, never with reduced motion.
  // The offsets live on separate transform components from the scroll
  // zoom/scale, so nothing fights; the headline's vertical centring uses
  // the CSS `translate` property, so GSAP owns its y cleanly.
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const head = headRef.current;
    if (!stage || !section || !portrait || !head) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const px = gsap.quickTo(portrait, "x", { duration: 0.8, ease: "power3" });
    const py = gsap.quickTo(portrait, "y", { duration: 0.8, ease: "power3" });
    const hx = gsap.quickTo(head, "x", { duration: 0.8, ease: "power3" });
    const hy = gsap.quickTo(head, "y", { duration: 0.8, ease: "power3" });
    const labels = Array.from(section.querySelectorAll(".m3-label"));
    const lx = labels.map((el) => gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }));
    const ly = labels.map((el) => gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }));

    // The headline's vertical centring is the CSS `translate: 0 -50%`
    // property, not GSAP's y — GSAP's y is a pure mouse offset from 0.
    // (An earlier resize listener set y to -height/2, double-shifting the
    // headline on every resize; it is gone now.)

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;
      // The panel (and the portrait inside it) shrink as the hero scrolls,
      // so a fixed pixel offset would look weaker and weaker in the card.
      // Divide by the live scales so the figure moves the same on-screen
      // distance at every stage — the movement stays "entire" from the
      // intro right through to the card. Tarun asked for it clearly
      // bigger (the old ±7px was too minor to feel): the portrait now
      // moves ±14px at the extremes (28px across the full mouse travel),
      // the headline ±7px, the labels ±6px. (nx runs -0.5..0.5, so the
      // multiplier is twice the max offset.)
      const panel = panelRef.current;
      const panelScale =
        (panel ? (gsap.getProperty(panel, "scaleX") as number) : 1) || 1;
      const portraitScale = (gsap.getProperty(portrait, "scaleX") as number) || 1;
      const total = portraitScale * panelScale;
      px(nx * -28 / total); // ±14px on screen, opposite the mouse
      py(ny * -28 / total);
      // The headline and labels live in the panel, not the portrait, so
      // they only divide by the panel's scale.
      hx(nx * -14 / panelScale); // headline, half strength
      hy(ny * -14 / panelScale);
      lx.forEach((fn) => fn(nx * -12 / panelScale));
      ly.forEach((fn) => fn(ny * -12 / panelScale));
    };
    const onLeave = () => {
      px(0);
      py(0);
      hx(0);
      hy(0);
      lx.forEach((fn) => fn(0));
      ly.forEach((fn) => fn(0));
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

        {!reduced && (
          <div ref={wipeRef} className="m3-wipe">
            <div ref={wipeContentRef} className="m3-wipe-inner">
              <h2 className="m3-wipe-title">Selected Work</h2>
              <div className="m3-wipe-row">
                <ul className="m3-wipe-list">
                  {HERO_TILES.map((tile, i) => (
                    <li key={tile.id} className={i === wipeActive ? "m3-wipe-active" : undefined}>
                      <a href={tile.href}>
                        <span
                          className={
                            i === wipeActive ? "m3-wipe-dot m3-wipe-dot-filled" : "m3-wipe-dot"
                          }
                          aria-hidden="true"
                        />
                        <span className="m3-wipe-name">{tile.name}</span>
                        <span className="m3-wipe-stack">{tile.stack}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  key={HERO_TILES[wipeActive].id}
                  className="m3-wipe-card"
                  href={HERO_TILES[wipeActive].href}
                >
                  <img src={HERO_TILES[wipeActive].src} alt={HERO_TILES[wipeActive].alt} />
                  <span className="m3-wipe-card-name">{HERO_TILES[wipeActive].name}</span>
                  <span className="m3-wipe-card-line">{HERO_TILES[wipeActive].line}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {reduced && (
        <div className="m3-grid-static">
          <GridTiles />
        </div>
      )}
    </section>
  );
}
