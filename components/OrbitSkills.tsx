"use client";
import { Terminal } from "lucide-react";

const RINGS: { items: string[]; r: string; dur: string; dir: string }[] = [
  { items: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "Docker"], r: "45cqw", dur: "60s", dir: "normal" },
  { items: ["FastAPI", "MongoDB", "Redis", "Express", "Git"], r: "31cqw", dur: "44s", dir: "reverse" },
  { items: ["SQL", "JavaScript", "Linux", "Flutter"], r: "18cqw", dur: "30s", dir: "normal" },
];

export default function OrbitSkills() {
  return (
    <figure className="orbit-skills" aria-label="Orbiting tech stack">
      <div className="orbit-scene">
        {RINGS.map((ring, ri) => (
          <div
            key={ri}
            className="orbit-ring"
            style={{ "--r": ring.r, "--dur": ring.dur, "--dir": ring.dir } as React.CSSProperties}
          >
            {ring.items.map((tech, i) => (
              <span
                key={tech}
                className="orbit-pos"
                style={{ "--a": `${(i * 360) / ring.items.length}deg` } as React.CSSProperties}
              >
                <span className="orbit-badge">{tech}</span>
              </span>
            ))}
          </div>
        ))}
        <div className="orbit-core">
          <Terminal size={26} strokeWidth={1.75} />
        </div>
      </div>
      <figcaption className="orbit-caption">ORBIT.SYS — LIVE</figcaption>
    </figure>
  );
}
