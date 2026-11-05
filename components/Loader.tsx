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

export default function Loader({ onDone, ready = true }: { onDone: () => void; ready?: boolean }) {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const done = useRef(false);
  // The Loader used to finish on a fixed timer while the hero photos were
  // still downloading, lifting onto a blank hero. It now waits for `ready`
  // (first hero frame decoded, fonts in) — but never longer than 6s, so a
  // failed asset can never trap the user on this screen.
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const finish = () => {
      if (!done.current) {
        done.current = true;
        onDone();
      }
    };
    const finishWhenReady = () => {
      if (done.current) return;
      if (!readyRef.current && Date.now() - startedAt.current < 6000) {
        timers.push(setTimeout(finishWhenReady, 200));
        return;
      }
      finish();
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (reduced) {
      timers.push(
        setTimeout(() => {
          setLines(LINES);
          setProgress(100);
        }, 30)
      );
      timers.push(setTimeout(finishWhenReady, 480));
      return () => timers.forEach(clearTimeout);
    }
    let li = 0;
    const tick = () => {
      li += 1;
      setLines(LINES.slice(0, li));
      setProgress(Math.round((li / LINES.length) * 100));
      if (li < LINES.length) timers.push(setTimeout(tick, 210));
      else timers.push(setTimeout(finishWhenReady, 380));
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
