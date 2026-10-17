import Marquee from "./Marquee";
import ScrubText from "./ScrubText";

const DIVIDER_ITEMS = [
  "SHIPPED NOT SHELVED",
  "PRODUCTION SYSTEMS",
  "FULL STACK",
  "SECURITY-MINDED",
  "OPEN FOR WORK",
];

export default function Interlude() {
  return (
    <div className="interlude" aria-label="Interlude">
      <Marquee
        items={DIVIDER_ITEMS}
        baseSpeed={1.8}
        reverse
        separator="◆"
        className="marquee-div"
      />
      <div className="container">
        <ScrubText
          className="interlude-statement"
          text="I turn ambiguous ideas into production systems — designed, hardened, and shipped."
        />
      </div>
    </div>
  );
}
