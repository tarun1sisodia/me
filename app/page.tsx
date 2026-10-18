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
import Hero from "@/components/Hero";
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
        <Hero started={loaded} />
        <HeroSub started={loaded} />
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
    </>
  );
}
