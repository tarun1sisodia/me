import Image from "next/image";
import { Mail } from "lucide-react";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "./BrandIcons";
import { PROFILE, SOCIALS } from "@/lib/data";

const ICONS = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Twitter: XIcon,
};

export default function Connect() {
  return (
    <section className="section connect" id="connect" aria-label="Connect">
      <div className="container">
        <Reveal>
          <p className="sec-meta">
            <span className="sec-num">04</span>
            <span className="sec-sep" aria-hidden="true">
              /
            </span>
            <span className="sec-label">CONNECT</span>
          </p>
        </Reveal>
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
                <a className="btn btn-primary btn-lg" href={`mailto:${PROFILE.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  {PROFILE.email}
                </a>
              </Magnetic>
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
      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026&nbsp;{PROFILE.name}</span>
          <span>{PROFILE.location}</span>
          <span>built with next.js — no templates harmed</span>
        </div>
      </footer>
    </section>
  );
}
