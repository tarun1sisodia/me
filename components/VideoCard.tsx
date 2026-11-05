"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type YouTubePlayer = { destroy: () => void };

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export default function VideoCard({
  videoId,
  poster,
  posterAlt,
  title,
}: {
  videoId?: string;
  poster: string;
  posterAlt: string;
  title: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [state, setState] = useState<"idle" | "playing" | "soon">("idle");

  useEffect(() => {
    if (state !== "playing" || !videoId) return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [state, videoId]);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const play = () => {
    if (!videoId) {
      setState("soon");
      return;
    }
    setState("playing");
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/20">
      {state === "playing" ? (
        <div ref={mountRef} className="h-full w-full" />
      ) : (
        <button
          type="button"
          onClick={play}
          className="group relative block h-full w-full cursor-pointer"
          aria-label={`Play ${title} video`}
        >
          <img
            src={poster}
            alt={posterAlt}
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-70"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#ff6b35] text-white shadow-[0_0_40px_rgba(255,107,53,0.55)] transition group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-current" />
            </span>
          </span>
          {state === "soon" && (
            <span className="absolute inset-x-0 bottom-0 bg-black/80 px-4 py-3 text-center text-sm text-white">
              Video coming soon — the walkthrough is being uploaded to YouTube.
            </span>
          )}
        </button>
      )}
    </div>
  );
}
