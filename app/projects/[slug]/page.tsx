import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, projectSlug } from "@/lib/data";
import GlyphPortal from "@/components/ui/glyph-portal";
import Timeline from "@/components/ui/timeline";
import VideoCard from "@/components/VideoCard";
import ProjectPoints from "@/components/ProjectPoints";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: projectSlug(p.name) }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => projectSlug(p.name) === slug);
  if (!project) notFound();

  const github = project.links.find((l) => l.label === "GitHub");
  const live = project.links.find((l) => l.label === "Live site");

  return (
    <main className="relative z-10">
      <GlyphPortal
        word={project.name.toUpperCase()}
        interactive
        enterLabel="Step inside"
        style={{
          "--gp-paper": "transparent",
          "--gp-ink": "#f5f5f5",
          "--gp-field": "#ff6b35",
          "--gp-foreground": "#ffffff",
        }}
        background={
          project.image ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "scale(var(--gp-field-scale,1))",
              }}
            >
              <img
                src={project.image}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ) : undefined
        }
        front={
          <div style={{ padding: "clamp(20px, 4vw, 44px)", pointerEvents: "none" }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#f5f5f5",
                textShadow: "0 1px 12px rgba(0,0,0,0.55)",
              }}
            >
              Tarun Sisodia — Project
            </p>
          </div>
        }
      >
        <div className="mx-auto w-full max-w-4xl">
          <VideoCard
            videoId={project.videoId}
            poster={project.image ?? ""}
            posterAlt={project.imageAlt ?? project.name}
            title={project.name}
          />
          <div className="mt-8 rounded-2xl bg-black/55 p-6 backdrop-blur-md sm:p-8">
            <h1 className="text-5xl font-bold leading-none text-white sm:text-7xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              {project.outcome}
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              {project.stack.join("  ·  ")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {github && (
                <a
                  href={github.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
                >
                  GitHub
                </a>
              )}
              {live && (
                <a
                  href={live.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/40"
                >
                  Live site
                </a>
              )}
            </div>
          </div>
        </div>
      </GlyphPortal>

      <ProjectPoints points={project.points} />

      <Timeline
        title={`${project.name} Timeline`}
        periodLabel={project.timeline ? "2026" : "2020-2026"}
        imageUrl={project.image}
        imageAlt={project.imageAlt ?? project.name}
        activeColor="#ff6b35"
        backgroundColor="#0a0a0a"
        textColor="#f5f5f5"
        mutedTextColor="#a1a1aa"
        duration={1.4}
        topItems={project.timeline?.top}
        bottomItems={project.timeline?.bottom}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-20">
        <Link href="/" className="plink">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
