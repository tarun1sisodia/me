export default function GridSweep({ lines = 14 }: { lines?: number }) {
  return (
    <div className="gridsweep" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="gridsweep-line" />
      ))}
      <span className="gridsweep-band" />
    </div>
  );
}
