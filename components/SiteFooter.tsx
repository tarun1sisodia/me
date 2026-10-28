"use client";

// SiteFooter — DoodleCrewFooter dressed for this portfolio: wordmark TARUN
// with one crew member per letter, Tarun's real links, and colours wired to
// the site theme (--bg / --text / --accent) so it follows the dark/light
// toggle. Its two action buttons split the job: "Start a project" dispatches
// "contact:open", which Connect listens for and opens the lead form with,
// and "Say hello" is a plain mailto to his work inbox.

import DoodleCrewFooter from "./DoodleCrewFooter";

const openForm = () => {
  window.dispatchEvent(new CustomEvent("contact:open"));
};

export default function SiteFooter() {
  return (
    <DoodleCrewFooter
      wordmark="TARUN"
      brand="tarun"
      blurb="Full-stack developer building production systems — travel platforms, clinic backends, and the portfolio you're standing in. Based in Greater Noida, open for work."
      tagline="Full-stack developer — shipped, not shelved."
      columns={[
        {
          title: "Work",
          links: [
            { label: "Selected work", href: "#work" },
            { label: "GitHub", href: "https://github.com/tarun1sisodia" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/tarun1sisodia" },
          ],
        },
        {
          title: "Navigate",
          links: [
            { label: "Home", href: "#top" },
            { label: "Tech stack", href: "#stack" },
            { label: "Open channel", href: "#connect" },
          ],
        },
        {
          title: "Contact",
          links: [
            { label: "Email", href: "mailto:coccoder999@gmail.com" },
            { label: "WhatsApp", href: "https://wa.me/919536454306" },
            { label: "Résumé", href: "/resume.pdf" },
          ],
        },
        {
          title: "Elsewhere",
          links: [
            { label: "Instagram", href: "https://www.instagram.com/tarun1sisodia" },
            { label: "X", href: "https://x.com/tarun1sisodia" },
            { label: "ArenaAI", href: "https://agraskbagheltourandtravels.com" },
          ],
        },
      ]}
      actions={[
        { label: "Start a project", icon: "bolt", variant: "solid", onClick: openForm },
        { label: "Say hello", icon: "heart", variant: "outline", href: "mailto:work.tarun1sisodia@gmail.com" },
      ]}
      copyright="© 2026 Tarun Sisodia · Greater Noida, India"
      legal={[]}
      socials={[]}
      palette={{
        background: "var(--bg)",
        ink: "var(--text)",
        accent: "var(--accent)",
      }}
      fontFamily='"Space Grotesk", system-ui, sans-serif'
      crew={[
        { kind: "yeti", letter: 0, seat: "front", offset: -0.32, name: "Bruno", says: "I lift the heavy backend stuff." },
        { kind: "bird", letter: 1, seat: "top", offset: 0.02, name: "Pip", says: "Post me @tarun1sisodia." },
        { kind: "mushroom", letter: 2, seat: "front", offset: 0.12, scale: 0.95, name: "Morel", says: "I'm a fun guy." },
        { kind: "kid", letter: 3, seat: "top", offset: -0.05, name: "Juno", says: "Up here! Best seat in the house." },
        { kind: "ghost", letter: 4, seat: "behind", offset: 0, name: "Boo", says: "Boo! …sorry. Hi." },
      ]}
    />
  );
}
