import Parallax from "./Parallax";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";

export default function SectionHeading({
  num,
  label,
  title,
  blurb,
  index,
  kicker,
}: {
  num?: string;
  label: string;
  title: string;
  blurb?: string;
  index?: string;
  kicker?: string;
}) {
  return (
    <div className="sec-head">
      {index && (
        <div className="chapter-rule" aria-hidden="true">
          <div className="container chapter-row">
            <span className="chapter-label">
              <span className="chapter-bullet" />
              {index} / {label}
            </span>
            {kicker && <span className="chapter-kicker">{kicker}</span>}
          </div>
        </div>
      )}
      {num && (
        <Parallax speed={0.12} className="sec-ghost-wrap">
          <span className="sec-ghost" aria-hidden="true">
            {num}
          </span>
        </Parallax>
      )}
      <Reveal>
        <p className="sec-meta">
          {num && (
            <>
              <span className="sec-num">{num}</span>
              <span className="sec-sep" aria-hidden="true">
                /
              </span>
            </>
          )}
          <span className="sec-label">{label}</span>
        </p>
      </Reveal>
      <SplitReveal text={title} className="sec-title" />
      {blurb && (
        <Reveal>
          <p className="sec-blurb">{blurb}</p>
        </Reveal>
      )}
    </div>
  );
}
