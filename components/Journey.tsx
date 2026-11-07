"use client";
import SectionHeading from "./SectionHeading";
import Timeline from "@/components/ui/timeline";
import { PATH_TIMELINE } from "@/lib/data";

// 06 / THE PATH — the same horizontal scrub Timeline the project pages use,
// fed with the real journey instead of the demo storyline. The portrait
// that used to sit beside the list now opens the timeline as its first card.
export default function Journey() {
  return (
    <section className="section journey" aria-label="Journey">
      <div className="container">
        <SectionHeading
          index="06"
          label="THE PATH"
          kicker="STILL BECOMING"
          title="The road so far."
        />
      </div>
      <Timeline
        title="The Path"
        periodLabel="2022 — Now"
        imageUrl="/photos/photo-bw-double-exposure.png"
        imageAlt="Artistic double-exposure portrait of Tarun Sisodia"
        activeColor="#ff6b35"
        backgroundColor="transparent"
        textColor="var(--text)"
        mutedTextColor="var(--muted)"
        duration={1.4}
        topItems={PATH_TIMELINE.top}
        bottomItems={PATH_TIMELINE.bottom}
      />
    </section>
  );
}
