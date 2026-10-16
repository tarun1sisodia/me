import Reveal from "./Reveal";

export default function SectionHeading({
  num,
  label,
  title,
  blurb,
}: {
  num?: string;
  label: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="sec-head">
      {num && (
        <span className="sec-ghost" aria-hidden="true">
          {num}
        </span>
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
        <h2 className="sec-title">{title}</h2>
        {blurb && <p className="sec-blurb">{blurb}</p>}
      </Reveal>
    </div>
  );
}
