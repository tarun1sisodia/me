// Remembering where the user was on the home page, so coming back
// from a project lands them on the exact same spot instead of the top.
//
// Saved when a project link is clicked (hero tiles, wipe list/card,
// tunnel cards). Read once when the home page mounts: if the save is
// there and fresh (under 10 minutes), the Loader and the hero entry
// are skipped and the scroll position is restored. The timestamp stops
// a stale save from yanking the scroll on a much later fresh visit
// (for example, coming back days later from an external link).

const KEY = "m3-return-scroll";

type Saved = { y: number; t: number };

export function saveHomeScroll() {
  try {
    const v: Saved = { y: window.scrollY, t: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // Storage is a bonus; never break navigation over it.
  }
}

export function takeHomeScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const v = JSON.parse(raw) as Saved;
    if (!v || !Number.isFinite(v.y) || !Number.isFinite(v.t)) return null;
    if (Date.now() - v.t > 10 * 60 * 1000) return null;
    return v.y;
  } catch {
    return null;
  }
}
