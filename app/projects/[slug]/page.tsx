import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, projectSlug } from "@/lib/data";

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
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-6 py-24">
      <Link href="/" className="mb-10 w-fit text-sm font-medium tracking-wide text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400">
        ← Back to home
      </Link>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
        Project
      </p>
      <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-7xl dark:text-zinc-50">
        {project.name}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        {project.outcome}
      </p>
      <p className="mt-8 text-sm tracking-wide text-zinc-500 dark:text-zinc-400">
        {project.stack.join(" · ")}
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        {github && (
          <a href={github.href} target="_blank" rel="noreferrer" className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
            GitHub
          </a>
        )}
        {live && (
          <a href={live.href} target="_blank" rel="noreferrer" className="rounded-full border border-zinc-400 px-5 py-2.5 text-sm font-semibold text-zinc-800 dark:border-zinc-600 dark:text-zinc-100">
            Live site
          </a>
        )}
      </div>
    </main>
  );
}
