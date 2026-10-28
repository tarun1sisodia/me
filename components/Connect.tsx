"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Download, Mail, MessageCircle, X } from "lucide-react";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import WordmarkReveal from "./WordmarkReveal";
import LeadForm from "./LeadForm";
import LazyScene from "./LazyScene";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "./BrandIcons";
import { PROFILE, SOCIALS } from "@/lib/data";

const WaveField = dynamic(() => import("./WaveField"), { ssr: false });

const ICONS = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Twitter: XIcon,
};

export default function Connect() {
  // The lead form is no longer open by default: it opens as a modal when
  // either of the footer buttons dispatches "contact:open".
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const open = () => setFormOpen(true);
    window.addEventListener("contact:open", open);
    return () => window.removeEventListener("contact:open", open);
  }, []);

  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFormOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formOpen]);

  return (
    <section className="section connect" id="connect" aria-label="Connect">
      <LazyScene>
        <WaveField />
      </LazyScene>
      <div className="chapter-rule" aria-hidden="true">
        <div className="container chapter-row">
          <span className="chapter-label">
            <span className="chapter-bullet" />
            09 / OPEN CHANNEL
          </span>
          <span className="chapter-kicker">RESPONSE TIME · FAST</span>
        </div>
      </div>
      <WordmarkReveal />
      <div className="container connect-front">
        <h2 className="sr-only">Let&apos;s build something</h2>
        <div className="connect-grid">
          <Reveal>
            <div className="duotone connect-photo">
              <Image
                src="/photos/portrait-smiling-arms-crossed.jpg"
                alt="Tarun Sisodia smiling with arms crossed"
                fill
                sizes="(max-width: 900px) 70vw, 24vw"
              />
            </div>
          </Reveal>
          <div className="connect-copy">
            <Reveal>
              <p className="connect-text">
                Have a project, a role, or just an idea worth talking about? My
                inbox is open.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <Magnetic>
                <a
                  className="btn btn-primary btn-lg"
                  href={`mailto:${PROFILE.email}`}
                  data-cursor="SAY HI"
                >
                  <Mail size={16} aria-hidden="true" />
                  {PROFILE.email}
                </a>
              </Magnetic>
            </Reveal>
            <Reveal delay={0.11}>
              <div className="connect-alt">
                <a className="btn btn-ghost" href="/resume.pdf" download data-cursor="GET">
                  <Download size={16} aria-hidden="true" />
                  Résumé
                </a>
                <a
                  className="btn btn-ghost"
                  href="https://wa.me/919536454306?text=Hi%20Tarun%2C%20saw%20your%20portfolio."
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="CHAT"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="socials">
                {SOCIALS.map((s) => {
                  const Icon = ICONS[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn"
                      aria-label={`${s.label} — tarun1sisodia`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
              <p className="social-handle">@tarun1sisodia — everywhere</p>
            </Reveal>
          </div>
        </div>
      </div>
      {formOpen && (
        <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Start a project">
          <div className="contact-modal-backdrop" onClick={() => setFormOpen(false)} />
          <div className="contact-modal-wrap">
            <button
              type="button"
              className="contact-modal-close"
              aria-label="Close form"
              onClick={() => setFormOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="contact-modal-card">
              <LeadForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
