"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import StatsBand from "@/components/StatsBand";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
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
      <main>
        <Hero started={loaded} />
        <Marquee />
        <StatsBand />
        <About />
        <Journey />
        <Work />
        <Skills />
        <Connect />
      </main>
    </>
  );
}
