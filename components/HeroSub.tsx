"use client";
import Words from "./Words";

export default function HeroSub({ started }: { started: boolean }) {
  return (
    <div className="hero-sub-strip">
      <div className="container">
        <Words
          text="I build real systems — full-stack developer"
          className="hero-sub-new"
          active={started}
          tag="p"
        />
        <p className="hero-story-cue">
          STORY BEGINS NOW <span aria-hidden="true">↓</span>
        </p>
      </div>
    </div>
  );
}
