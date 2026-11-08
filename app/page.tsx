"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeToggle from "@/components/ThemeToggle";
import MusicToggle from "@/components/MusicToggle";
import { preloadHeroFrames } from "@/lib/hero-preload";
import { HERO_PORTRAIT, HERO_TILES } from "@/lib/data";
import { takeHomeScroll } from "@/lib/return-home";
import PageCollageHero from "@/components/ui/page-collage-hero";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import Marquee from "@/components/Marquee";
import StatsBand from "@/components/StatsBand";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Interlude from "@/components/Interlude";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Now from "@/components/Now";
import Connect from "@/components/Connect";
import SiteFooter from "@/components/SiteFooter";

const HERO_TILE_SRCS = HERO_TILES.map((t) => t.src);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  // True once the first hero tiles are decoded (and fonts are in). The
  // Loader waits on this, so it never lifts onto a blank hero; a 6s cap in
  // the Loader itself is the fallback if an asset fails.
  const [heroReady, setHeroReady] = useState(false);
  // True when the user is coming BACK from a project page: the Loader
  // and the hero entry are skipped, and the scroll position saved when
  // the project link was clicked is restored, so they continue from
  // the exact place they left — no replay, no jump to the top.
  const [skipEntry, setSkipEntry] = useState(false);

  useEffect(() => {
    const y = takeHomeScroll();
    if (y == null) return;
    setSkipEntry(true);
    setLoaded(true);
    // The hero's ScrollTrigger is set up by the time this runs (child
    // effects run first), so restore now and once more after layout
    // settles, in case lazy images below shifted anything.
    const restore = () => {
      window.scrollTo(0, y);
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger.refresh());
    };
    const t1 = window.setTimeout(restore, 50);
    const t2 = window.setTimeout(restore, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setHeroReady(true);
    }, 6000);
    Promise.allSettled([
      preloadHeroFrames([HERO_PORTRAIT, ...HERO_TILE_SRCS], 3),
      document.fonts?.ready ?? Promise.resolve(),
    ]).then(() => {
      if (!cancelled) setHeroReady(true);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    import("gsap/ScrollTrigger").then((m) => {
      if (!cancelled) m.ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [loaded ]);

  return (
    <>
      {!loaded && <Loader ready={heroReady} onDone={() => setLoaded(true)} />}
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <ThemeToggle />
      <MusicToggle />
      <main>
        <div id="top">
          <PageCollageHero started={loaded} skipEntry={skipEntry} />
        </div>
        <section id="gallery" aria-label="Gallery" className="relative overflow-hidden">
          <PerspectiveTunnelHero />
        </section>
        <Marquee id="stack" />
        <StatsBand />
        <About />
        <Services />
        <Journey />
        <Interlude />
        <Process />
        <Skills />
        <Now />
        <Connect />
      </main>
      <SiteFooter />
    </>
  );
}
