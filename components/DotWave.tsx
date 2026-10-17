const COLS = 48;
const ROWS = 7;

export default function DotWave() {
  const dots = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      dots.push(
        <span
          key={`${c}-${r}`}
          className="dotwave-dot"
          style={{ animationDelay: `${(c * 0.09).toFixed(2)}s` }}
        />
      );
    }
  }
  return (
    <div className="dotwave-wrap" aria-hidden="true">
      <div className="dotwave">{dots}</div>
      <p className="dotwave-caption">DOT.MATRIX — LIVE</p>
    </div>
  );
}
