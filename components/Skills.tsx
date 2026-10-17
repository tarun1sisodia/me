import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import OrbitSkills from "./OrbitSkills";
import { SKILL_GROUPS } from "@/lib/data";

export default function Skills() {
  return (
    <section className="section skills" id="skills" aria-label="Skills">
      <div className="container">
        <SectionHeading
          index="07"
          label="ARSENAL"
          kicker="BATTLE-TESTED"
          title="The toolkit."
          blurb="What I reach for when something needs to exist by Friday."
        />
        <OrbitSkills />
        <div className="skills-grid">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 0.07}>
              <div className="skill-group">
                <h3 className="skill-title">{group.title}</h3>
                <div className="pills">
                  {group.items.map((item) => (
                    <span key={item} className="pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
