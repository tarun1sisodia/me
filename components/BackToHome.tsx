"use client";

import { useEffect } from "react";
import Link from "next/link";
import { playTick } from "@/lib/guitar";

// The "← Back to home" link on project pages. Going back plays one
// short tick — the radio-button click — and the home page restores the
// exact scroll position the user left from (saved when the project
// link was clicked). The tick also fires on the browser's own back
// button, via popstate: router.push does not fire popstate, so the
// in-page link never double-ticks.
export default function BackToHome() {
  useEffect(() => {
    const onPop = () => playTick();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <Link href="/" className="plink" onClick={() => playTick()}>
      ← Back to home
    </Link>
  );
}
