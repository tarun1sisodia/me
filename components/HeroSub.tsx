"use client";
import Words from "./Words";
import { PROFILE } from "@/lib/data";

export default function HeroSub({ started }: { started: boolean }) {
  return (
    <div className="hero-sub-strip">
      <div className="container">
        <Words
          text={PROFILE.subline}
          className="hero-sub"
          active={started}
          tag="p"
        />
        <Words
          text="I build production systems — APIs, payments, platforms. Full stack, security-minded, shipped not shelved."
          className="hero-desc"
          active={started}
          tag="p"
          delay={0.25}
        />
      </div>
    </div>
  );
}
