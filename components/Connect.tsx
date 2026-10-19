import dynamic from "next/dynamic";
import Image from "next/image";
import { Download, Mail, MessageCircle } from "lucide-react";
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
      <div className="container connect-front">
        <Reveal>
          <h2 className="connect-title">
            Let&apos;s build
            <br />
            something<span className="connect-dot">.</span>
          </h2>
        </Reveal>
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
        <Reveal>
          <LeadForm />
        </Reveal>
      </div>
      <WordmarkReveal />
      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026&nbsp;{PROFILE.name}</span>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </section>
  );
}
