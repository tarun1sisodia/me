// Shared hero-frame preload cache.
//
// The freeze Tarun hit: the Loader finished on a fixed timer (~1.4s) while
// the hero photos were still downloading, so the loading screen lifted onto
// a blank canvas and a scrub timeline that did not exist yet — the hero only
// came alive after a hard refresh, once the images were cached.
//
// Fix: page.tsx starts preloading the first frames the moment the page
// mounts (behind the Loader) and the Loader only lifts once the first frame
// is decoded (with a hard 6s fallback so a failed image can never trap the
// user). HeroScrub reuses these same Image objects instead of starting a
// second download for the same files.

const cache = new Map<string, HTMLImageElement>();

export function preloadHeroImage(src: string, highPriority = false): Promise<HTMLImageElement> {
  const hit = cache.get(src);
  if (hit) {
    if (hit.complete && hit.naturalWidth > 0) return Promise.resolve(hit);
    return new Promise((resolve, reject) => {
      hit.addEventListener("load", () => resolve(hit), { once: true });
      hit.addEventListener("error", () => reject(new Error("hero frame failed: " + src)), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    if (highPriority)
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
    img.onload = () => {
      // Wait for the decode, not just the download, so the first canvas
      // draw never blocks on the main thread.
      if (img.decode) img.decode().then(() => resolve(img)).catch(() => resolve(img));
      else resolve(img);
    };
    img.onerror = () => reject(new Error("hero frame failed: " + src));
    img.src = src;
    cache.set(src, img);
  });
}

/** A fully decoded frame, if this one has already been preloaded. */
export function getPreloadedHeroImage(src: string): HTMLImageElement | undefined {
  const img = cache.get(src);
  return img && img.complete && img.naturalWidth > 0 ? img : undefined;
}

/**
 * Decode the first `urgentCount` frames now; the rest warm up in the
 * background once the browser is idle, so they are ready before the user
 * scrolls deep enough to need them. Resolves once the urgent frames settle
 * (load or fail) — never rejects, so the Loader's fallback owns the timeout.
 */
export async function preloadHeroFrames(srcs: string[], urgentCount = 3): Promise<void> {
  const urgent = srcs.slice(0, urgentCount).map((s) => preloadHeroImage(s, true));
  await Promise.allSettled(urgent);
  const rest = srcs.slice(urgentCount);
  if (!rest.length) return;
  const idle = (cb: () => void) => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback;
    if (typeof ric === "function") ric(cb, { timeout: 2000 });
    else window.setTimeout(cb, 600);
  };
  idle(() => {
    rest.forEach((s) => preloadHeroImage(s).catch(() => {}));
  });
}
