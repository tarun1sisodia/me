"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicToggle() {
  const [on, setOn] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio("/audio/on-and-on.mp3");
    audio.current.loop = true;
    audio.current.volume = 0.6;
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const toggle = async () => {
    if (!audio.current) return;
    if (on) {
      audio.current.pause();
      setOn(false);
      return;
    }
    try {
      await audio.current.play();
      setOn(true);
    } catch {
      setOn(false);
    }
  };

  return (
    <button
      type="button"
      className="music-toggle"
      aria-pressed={on}
      onClick={toggle}
      aria-label={on ? "Turn background beat off" : "Turn background beat on"}
    >
      <span className="music-eq" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      BEAT {on ? "ON" : "OFF"}
    </button>
  );
}
