import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const ITEMS = [
  { k: "STUDYING", v: "MCA Cyber Security, Galgotias University — final year, 2027 batch" },
  { k: "INTERNSHIP", v: "Backend Developer Intern @ Aarogya Virohan — FastAPI, PostgreSQL" },
  { k: "FREELANCE", v: "Production backend for a travel business — Fastify, Razorpay, Supabase" },
  { k: "LEARNING", v: "GRC & VAPT — grinding toward the security track" },
  { k: "STATUS", v: "Open for internships, freelance builds, and good conversations" },
];

export default function Now() {
  return (
    <section className="section now" id="now" aria-label="Now">
      <div className="container">
        <SectionHeading
          index="08"
          label="NOW"
          kicker="LAST UPDATED · OCT 2026"
          title="Currently."
          blurb="What has my attention this month."
        />
        <Reveal>
          <dl className="now-list">
            {ITEMS.map((item) => (
              <div key={item.k} className="now-row">
                <dt>
                  <span className="now-dot" aria-hidden="true" />
                  {item.k}
                </dt>
                <dd>{item.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
