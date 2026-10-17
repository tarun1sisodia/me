"use client";
import dynamic from "next/dynamic";
import { useRef, type ReactNode, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Film, GraduationCap, Music } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { GithubIcon } from "./BrandIcons";
import { PROJECTS, type Project } from "@/lib/data";

const RippleGrid = dynamic(() => import("./RippleGrid"), { ssr: false });

const ICONS = { Music, Film, GraduationCap };

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      data-cursor="VIEW"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const Icon = project.icon ? ICONS[project.icon] : null;
  return (
    <TiltCard className={`project-card${featured ? " featured" : ""}`}>
      {project.image ? (
        <div className="project-visual">
          <Image
            src={project.image}
            alt={`${project.name} — build documentation on screen`}
            fill
            sizes={featured ? "(max-width: 900px) 100vw, 1100px" : "(max-width: 900px) 100vw, 34vw"}
          />
        </div>
      ) : (
        <div className="project-visual project-icon" aria-hidden="true">
          {Icon && <Icon size={46} strokeWidth={1.25} />}
        </div>
      )}
      <div className="project-body">
        <div className="project-top">
          <h3 className="project-name">{project.name}</h3>
          {featured && <span className="project-flag">flagship</span>}
        </div>
        <p className="project-outcome">{project.outcome}</p>
        <div className="pills">
          {project.stack.map((s) => (
            <span key={s} className="pill">
              {s}
            </span>
          ))}
        </div>
        <div className="project-links">
          {project.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="plink">
              {l.label === "GitHub" ? (
                <GithubIcon size={15} />
              ) : (
                <ArrowUpRight size={15} aria-hidden="true" />
              )}
              <span className="roll" aria-label={l.label}>
                <span>{l.label}</span>
                <span aria-hidden="true">{l.label}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Work() {
  const [featured, ...rest] = PROJECTS;
  return (
    <section className="section work" id="work" aria-label="Work">
      <RippleGrid />
      <div className="container work-front">
        <SectionHeading
          num="03"
          label="WORK"
          title="Shipped, not shelved."
          blurb="Real systems for real users — not tutorial projects."
        />
        <p className="work-count" aria-label={`Selected work, ${PROJECTS.length} projects`}>
          <span className="work-count-num">01</span>
          <span className="work-count-sep" aria-hidden="true">/</span>
          <span>{String(PROJECTS.length).padStart(2, "0")}</span>
          <span className="work-count-label">selected work</span>
        </p>
        <Reveal>
          <ProjectCard project={featured} featured />
        </Reveal>
        <div className="project-grid">
          {rest.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.08}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
