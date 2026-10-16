import Image from "next/image";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { ABOUT_STORY, CURRENTLY } from "@/lib/data";

export default function About() {
  return (
    <section className="section about" id="about" aria-label="About">
      <div className="container">
        <SectionHeading
          label="ABOUT"
          title="Not a template person."
          blurb="The short version of a long story with computers."
        />
        <div className="about-grid">
          <div className="about-photos">
            <Reveal>
              <div className="duotone about-portrait">
                <Image
                  src="/photos/portrait-studio-clean.jpg"
                  alt="Portrait of Tarun Sisodia"
                  fill
                  sizes="(max-width: 900px) 88vw, 30vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="about-action">
                <div className="about-action-frame">
                  <Image
                    src="/photos/workspace-me-coding-cafe.png"
                    alt="Tarun working on his laptop"
                    fill
                    sizes="(max-width: 900px) 88vw, 30vw"
                  />
                </div>
                <figcaption>{"// in the zone — laptop, always"}</figcaption>
              </figure>
            </Reveal>
          </div>
          <div className="about-copy">
            {ABOUT_STORY.map((line, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p className="about-line">{line}</p>
              </Reveal>
            ))}
            <Reveal delay={0.18}>
              <div className="currently-card">
                <p className="card-label">{"// currently"}</p>
                <ul>
                  {CURRENTLY.map((c) => (
                    <li key={c.label}>
                      <span className="currently-key">{c.label}</span>
                      <span className="currently-val">{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
