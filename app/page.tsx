"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import MotionToggle from "@/components/MotionToggle";
import ThemeToggle from "@/components/ThemeToggle";
import MusicToggle from "@/components/MusicToggle";
import MiniNav from "@/components/MiniNav";
import HeroSub from "@/components/HeroSub";
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
  "/photos/sticker-tarun.png",
  "/photos/portrait-hero-clean.jpg",
  "/photos/portrait-studio-clean.jpg",
  "/photos/portrait-smiling-arms-crossed.jpg",
  "/photos/sticker-tarun-halftone.png",
  "/photos/sticker-tarun-halftone-dark.png",
];

const main2FrameUrl = (i: number) => MAIN2_FRAMES[i];

export default function Home() {
  const [loaded, setLoaded] = useState(false);

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
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <MotionToggle />
      <ThemeToggle />
      <MusicToggle />
      <MiniNav />
      <main>
        <div id="top">
          <HeroScrub
            frameCount={MAIN2_FRAMES.length}
            frameUrl={main2FrameUrl}
            titleTop="TARUN"
            titleBottom="SISODIA"
            accentHex="#ff6b35"
            defaultAspect={920 / 971}
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
