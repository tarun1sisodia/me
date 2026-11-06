"use client";
import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import LazyScene from "./LazyScene";
import SphereImageGrid from "@/components/ui/img-sphere";
import { SKILL_GROUPS, TECH_SPHERE } from "@/lib/data";

export default function ArsenalSphere() {
  const [size, setSize] = useState(600);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("motion-off")
    );
    const update = () => setSize(Math.min(600, window.innerWidth - 32));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="section skills" id="skills" aria-label="Skills">
      <div className="container">
        <SectionHeading
          index="07"
          label="ARSENAL"
          kicker="BATTLE-TESTED"
          title="The toolkit."
          blurb="What I reach for when something needs to exist by Friday."
        />
        <div className="arsenal-sphere-wrap" style={{ height: size }}>
          <LazyScene>
            <div className="arsenal-sphere">
              <SphereImageGrid
                images={TECH_SPHERE}
                containerSize={size}
                sphereRadius={Math.round(size / 3)}
                dragSensitivity={0.8}
                momentumDecay={0.96}
                maxRotationSpeed={6}
                baseImageScale={0.15}
                hoverScale={1.3}
                perspective={1000}
                autoRotate={!reduced}
                autoRotateSpeed={0.2}
              />
            </div>
          </LazyScene>
        </div>
        <p className="arsenal-hint">Drag to spin &middot; Click a tech to read about it</p>
        <div className="arsenal-groups">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="arsenal-group">
              <h3 className="arsenal-group-title">{group.title}</h3>
              <div className="pills">
                {group.items.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
