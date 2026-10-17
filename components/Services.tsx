"use client";
import { useState } from "react";
import { Server, Layers, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const DISCIPLINES = [
  {
    id: "backend",
    label: "Backend",
    icon: Server,
    title: "APIs that survive production.",
    points: [
      "REST APIs with FastAPI and Fastify 5 — typed, tested, documented",
      "Auth with teeth: JWT plus clinic-isolation middleware",
      "Payments via Razorpay, PDFs via WeasyPrint",
      "PostgreSQL, MongoDB, Redis — picked per workload, not habit",
      "Dockerized and shipped on Render",
    ],
  },
  {
    id: "fullstack",
    label: "Full-Stack",
    icon: Layers,
    title: "From idea to deployed URL.",
    points: [
      "React + TypeScript frontends wired to real backends",
      "Travel platform live in production (ArenaAI)",
      "Flutter apps for mobile (SmartCampus)",
      "End-to-end ownership — database to deploy",
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
    title: "Threat-minded from line one.",
    points: [
      "MCA in Cyber Security — not a buzzword, a degree",
      "Hardened auth, isolated tenants, least privilege",
      "Security documentation and reporting (GRC / VAPT track)",
      "Input validation and safe defaults everywhere",
    ],
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const d = DISCIPLINES[active];
  const Icon = d.icon;

  return (
    <section className="section services" id="services" aria-label="What I do">
      <div className="container">
        <SectionHeading
          index="03"
          label="WHAT I DO"
          kicker="PICK A DISCIPLINE"
          title="Three ways to ship."
          blurb="One engineer, three disciplines. Switch hats below."
        />
        <Reveal>
          <div className="disc-toggle" role="tablist" aria-label="Disciplines">
            {DISCIPLINES.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={i === active}
                className={`disc-btn${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {item.label}
              </button>
            ))}
            <span className="disc-count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")}/03
            </span>
          </div>
        </Reveal>
        <div className="disc-panel" key={d.id}>
          <Reveal>
            <div className="disc-head">
              <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
              <h3>{d.title}</h3>
            </div>
            <ul className="disc-list">
              {d.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
