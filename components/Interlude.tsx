import Marquee from "./Marquee";
import ScrubText from "./ScrubText";
import GridSweep from "./GridSweep";

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
      <GridSweep />
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
          text="AI CAN WRITE but who will tell where to stop. that's where i come and that's how i build system."
        />
      </div>
    </div>
  );
}
