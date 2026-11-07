"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Scope the real problem first.",
  },
  {
    n: "02",
    title: "Design",
    body: "Contracts and schemas before code.",
  },
  {
    n: "03",
    title: "Build",
    body: "Typed, tested, reviewed. Shipped weekly.",
  },
  {
    n: "04",
    title: "Harden",
    body: "Auth, isolation, validation before launch.",
  },
  {
    n: "05",
    title: "Ship",
    body: "Dockerized, deployed, monitored. Then iterate.",
  },
];

export default function Process() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section process" id="process" aria-label="How I work">
      <div className="container">
        <SectionHeading
          index="05"
          label="HOW I WORK"
          kicker="NO CHAOS, JUST CADENCE"
          title="Boring process, exciting results."
        />
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <div className={`step${open === i ? " is-open" : ""}`}>
                <button
                  className="step-head"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                >
                  <span className="step-num">{s.n}</span>
                  <span className="step-title">{s.title}</span>
                  <Plus
                    size={18}
                    aria-hidden="true"
                    className="step-icon"
                  />
                </button>
                <div className="step-body" aria-hidden={open !== i}>
                  <p>{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
