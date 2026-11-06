"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeToggle from "@/components/ThemeToggle";
import MusicToggle from "@/components/MusicToggle";
import HeroSub from "@/components/HeroSub";
import { preloadHeroFrames } from "@/lib/hero-preload";
import { HeroScrub } from "@/components/ui/hero-scrub";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import Marquee from "@/components/Marquee";
import StatsBand from "@/components/StatsBand";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Work from "@/components/Work";
import Interlude from "@/components/Interlude";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Now from "@/components/Now";
import Connect from "@/components/Connect";
import SiteFooter from "@/components/SiteFooter";

const MAIN2_FRAMES = [
  "/photos/tarun-white-wall.jpg",
  "/photos/tarun-corridor-bw.jpg",
  "/photos/tarun-night-crowd.jpg",
  "/photos/tarun-arms-crossed-bw.jpg",
  "/photos/tarun-galgotias-night.jpg",
  "/photos/tarun-lobby-bench.jpg",
  "/photos/tarun-fest-night-smile.jpg",
  "/photos/tarun-smile-closeup.jpg",
];

const main2FrameUrl = (i: number) => MAIN2_FRAMES[i];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  // True once the first hero frames are decoded (and fonts are in). The
  // Loader waits on this, so it never lifts onto a blank hero; a 6s cap in
  // the Loader itself is the fallback if an asset fails.
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setHeroReady(true);
    }, 6000);
    Promise.allSettled([
      preloadHeroFrames(MAIN2_FRAMES, 3),
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
          <HeroScrub
            frameCount={MAIN2_FRAMES.length}
            frameUrl={main2FrameUrl}
            titleTop="TARUN"
            titleBottom="SISODIA"
            defaultAspect={920 / 971}
            started={loaded}
          />
        </div>
        <HeroSub started={loaded} />
        <section id="gallery" aria-label="Gallery" className="relative overflow-hidden">
          <PerspectiveTunnelHero />
        </section>
        <Marquee id="stack" />
        <StatsBand />
        <About />
        <Services />
        <Journey />
        <Work />
        <Process />
        <Interlude />
        <Skills />
        <Now />
        <Connect />
      </main>
      <SiteFooter />
    </>
  );
}
