"use client";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";

// Three.js is heavy — split it out of the first paint and mount it only on
// the client. The placeholder holds the same 82vh so nothing shifts.
const AgenticFactory3D = dynamic(() => import("@/components/ui/agentic-factory-3d"), {
  ssr: false,
  loading: () => (
    <div className="factory-loading" role="status">
      <i />
      <span>Assembling your machine</span>
    </div>
  ),
});

export default function Services() {
  return (
    <section className="section services" id="services" aria-label="What I do">
      <div className="container services-head">
        <SectionHeading
          index="03"
          label="WHAT I DO"
          kicker="FIVE AGENTS · ONE PIPELINE"
          title="Three ways to ship."
        />
      </div>
      <div className="factory-stage">
        <AgenticFactory3D height="82vh" />
      </div>
    </section>
  );
}
