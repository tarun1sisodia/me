"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

const LINES = [
  "> initializing portfolio v2.0",
  "> loading modules ............ OK",
  "> mounting sections .......... OK",
  "> calibrating cursor ......... OK",
  "> access granted",
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (!done.current) {
        done.current = true;
        onDone();
      }
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (reduced) {
      timers.push(
        setTimeout(() => {
          setLines(LINES);
          setProgress(100);
        }, 30)
      );
      timers.push(setTimeout(finish, 480));
      return () => timers.forEach(clearTimeout);
    }
    let li = 0;
    const tick = () => {
      li += 1;
      setLines(LINES.slice(0, li));
      setProgress(Math.round((li / LINES.length) * 100));
      if (li < LINES.length) timers.push(setTimeout(tick, 210));
      else timers.push(setTimeout(finish, 380));
    };
    timers.push(setTimeout(tick, 140));
    return () => timers.forEach(clearTimeout);
  }, [onDone, reduced]);

  return (
    <div className="loader" role="status" aria-label="Loading portfolio">
      <div className="loader-scan" aria-hidden="true" />
      <div className="loader-pct" aria-hidden="true">
        {progress}
        <span>%</span>
      </div>
      <div className="loader-box">
        {lines.map((line, i) => (
          <div key={i} className="loader-line">
            {line}
          </div>
        ))}
        <div className="loader-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
