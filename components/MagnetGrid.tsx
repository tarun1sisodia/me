"use client";
import { useEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";
import { SKILL_GROUPS } from "@/lib/data";

const RADIUS = 240;
const MAX_PULL = 34;

type Card = { x: number; y: number; vx: number; vy: number; released: boolean };

export default function MagnetGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("motion-off")
    )
      return;

    const cards: Card[] = SKILL_GROUPS.map(() => ({
      x: (Math.random() - 0.5) * 520,
      y: (Math.random() - 0.5) * 360,
      vx: 0,
      vy: 0,
      released: false,
    }));
    let homes: { x: number; y: number }[] = [];
    let px = -9999;
    let py = -9999;
    let pointerIn = false;
    let raf = 0;
    let entered = false;

    const measure = () => {
      const sr = section.getBoundingClientRect();
      homes = cardRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left - sr.left + r.width / 2,
          y: r.top - sr.top + r.height / 2,
        };
      });
    };

    const onMove = (e: PointerEvent) => {
      const sr = section.getBoundingClientRect();
      px = e.clientX - sr.left;
      py = e.clientY - sr.top;
      pointerIn = true;
    };
    const onLeave = () => {
      pointerIn = false;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (!c.released) continue;
        let tx = 0;
        let ty = 0;
        if (pointerIn && homes[i]) {
          const dx = px - homes[i].x;
          const dy = py - homes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 1) {
            const pull = (1 - dist / RADIUS) * MAX_PULL;
            tx = (dx / dist) * pull;
            ty = (dy / dist) * pull;
          }
        }
        c.vx = (c.vx + (tx - c.x) * 0.14) * 0.78;
        c.vy = (c.vy + (ty - c.y) * 0.14) * 0.78;
        c.x += c.vx;
        c.y += c.vy;
        const el = cardRefs.current[i];
        if (el) el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !entered) {
          entered = true;
          measure();
          cards.forEach((c, i) => {
            window.setTimeout(() => {
              c.released = true;
            }, i * 70);
          });
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    measure();
    window.addEventListener("resize", measure);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    io.observe(section);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="section skills magnet-section" id="skills" aria-label="Skills" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          index="07"
          label="ARSENAL"
          kicker="BATTLE-TESTED"
          title="The toolkit."
          blurb="What I reach for when something needs to exist by Friday."
        />
        <div className="magnet-grid">
          {SKILL_GROUPS.map((group, i) => (
            <div
              key={group.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="magnet-card"
            >
              <h3 className="magnet-title">{group.title}</h3>
              <div className="pills">
                {group.items.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
