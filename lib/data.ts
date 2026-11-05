import type { TimelineItem } from "@/components/ui/timeline";

export const PROFILE = {
  name: "Tarun Sisodia",
  role: "full-stack developer",
  subline: "full-stack developer — react · fastapi · postgresql",
  location: "Greater Noida, India",
  email: "coccoder999@gmail.com",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/tarun1sisodia", icon: "Github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/tarun1sisodia", icon: "Linkedin" },
  { label: "Instagram", href: "https://instagram.com/tarun1sisodia", icon: "Instagram" },
  { label: "X", href: "https://x.com/tarun1sisodia", icon: "Twitter" },
] as const;

export const MARQUEE_ITEMS = [
  "TypeScript", "Python", "FastAPI", "Fastify", "PostgreSQL", "MongoDB",
  "React", "Flutter", "Docker", "Redis", "Razorpay", "Cloudflare",
];

export const STATS = [
  { value: 5, suffix: "", label: "projects shipped" },
  { value: 25, suffix: "+", label: "technologies" },
  { value: 2, suffix: "", label: "production systems live" },
  { value: 4, suffix: "", label: "years coding" },
];

export interface JourneyEntry {
  period: string;
  title: string;
  org: string;
  detail: string;
  current?: boolean;
}

export const JOURNEY: JourneyEntry[] = [
  {
    period: "2022 — 2025",
    title: "BCA, Computer Science",
    org: "Agra University",
    detail: "Where it started. CS fundamentals, DSA, and the first lines of code that stuck.",
  },
  {
    period: "2025 — 2027",
    title: "MCA, Cyber Security",
    org: "Galgotias University",
    detail: "Final year. Going deep on security — GRC and VAPT direction.",
  },
  {
    period: "Apr 2026 — Present",
    title: "Backend Developer Intern",
    org: "Aarogya Virohan",
    detail: "Health-tech APIs with FastAPI + PostgreSQL. JWT auth with clinic-isolation middleware, prescription PDF builder.",
  },
  {
    period: "Aug 2026 — Present",
    title: "Freelance Backend Developer",
    org: "Tour & travel business",
    detail: "Production TypeScript + Fastify backend — fares, bookings, Razorpay payments, dispatch. Hardened, rate-limited, Dockerized on Render.",
  },
  {
    period: "2026",
    title: "ArenaAI shipped",
    org: "Production travel platform",
    detail: "Built and maintain a live travel platform — SSG, full SEO pipeline, Cloudflare deploys.",
  },
  {
    period: "Now",
    title: "Building in public",
    org: "Open to work",
    detail: "Shipping, learning security, and looking for what's next.",
    current: true,
  },
];

export const projectSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

export interface Project {
  name: string;
  outcome: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
  video?: string;
  videoId?: string;
  points: string[];
  /** One-line sign-off for the signature footer at the end of the project page. */
  signoff: string;
  timeline?: { top: TimelineItem[]; bottom: TimelineItem[] };
  icon?: "Music" | "Film" | "GraduationCap" | "HeartPulse";
  links: { label: string; href: string }[];
}

export const PROJECTS: Project[] = [
  {
    name: "ArenaAI",
    outcome: "Production travel platform for a real business — bookings, fares, payments, live and serving users.",
    stack: ["React", "TypeScript", "Fastify", "PostgreSQL", "Razorpay", "Cloudflare"],
    image: "/photos/projects/arenai-travel.webp",
    imageAlt: "Taj Mahal at sunrise",
    points: [
      "Live bookings, fares, and Razorpay payments for a real travel business",
      "Full SEO pipeline — SSG, sitemap, canonicals, and Cloudflare deploys",
      "Hardened production backend — rate-limited, Dockerized, handling real money",
    ],
    signoff:
      "ArenaAI is live and taking bookings — fares, payments, and dispatch for a real travel business. If you want something like it for yours, my inbox is open.",
    timeline: {
      top: [
        { id: "2026-aug", year: "2026", month: "August", content: "Production backend goes live — Fastify, Razorpay payments, Supabase and MongoDB" },
        { id: "2026-oct-seo", year: "2026", month: "October", content: "SEO overhaul ships — sitemap rebuilt, canonicals fixed, verified live" },
      ],
      bottom: [
        { id: "2026-oct-booking", year: "2026", month: "October", content: "Booking flow restyle and prerender crash fix land on main" },
      ],
    },
    links: [
      { label: "GitHub", href: "https://github.com/tarun1sisodia/ArenaAI" },
      { label: "Live site", href: "https://agraskbagheltourandtravels.com" },
    ],
  },
  {
    name: "FreeTune",
    outcome: "Scalable music-streaming backend with caching, rate limiting, and cloud audio storage.",
    stack: ["Node.js", "Express", "MongoDB", "Redis", "Cloudflare R2"],
    image: "/photos/projects/freetune-concert.webp",
    imageAlt: "Concert crowd under stage lights",
    points: [
      "Music-streaming backend with caching, rate limiting, and cloud audio storage",
      "Node.js and Express with MongoDB and Redis under the hood",
      "Audio served fast from Cloudflare R2",
    ],
    signoff:
      "FreeTune streams music on a backend built to scale — caching, rate limiting, and cloud audio. The code is on GitHub if you want to look inside.",
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "CineMatch",
    outcome: "Full-stack movie recommendations with content-based filtering (TF-IDF + cosine similarity).",
    stack: ["React", "FastAPI", "scikit-learn", "SQLite"],
    image: "/photos/projects/cinematch-cinema.webp",
    imageAlt: "Empty cinema theater seats",
    points: [
      "Content-based movie recommendations — TF-IDF plus cosine similarity",
      "React frontend talking to a FastAPI backend",
      "Scikit-learn ranking over a SQLite store",
    ],
    signoff:
      "CineMatch finds your next film with TF-IDF and cosine similarity — a full-stack recommender, frontend to ranking. Take a look at the code.",
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "SmartCampus",
    outcome: "Cross-platform attendance app for institutions — recording, teacher workflows, analytics.",
    stack: ["Flutter", "Node.js", "MySQL"],
    image: "/photos/projects/smartcampus-campus.webp",
    imageAlt: "University campus",
    points: [
      "Cross-platform attendance app for institutions",
      "Teacher workflows with recording and analytics",
      "Flutter frontend, Node.js and MySQL backend",
    ],
    signoff:
      "SmartCampus puts attendance in teachers' pockets — recording, workflows, and analytics, cross-platform. The build is on GitHub.",
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "BloodConnect",
    outcome: "Production-ready backend for a blood-donation connect app.",
    stack: ["JavaScript", "Node.js"],
    image: "/photos/projects/bloodconnect-donation.webp",
    imageAlt: "Blood bags ready for donation",
    points: [
      "Backend for a blood-donation connect app",
      "Production-ready Node.js service",
      "Built to connect donors with people who need blood",
    ],
    signoff:
      "BloodConnect exists to connect donors with people who need blood — a production-ready backend for a cause that matters.",
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia/bloodconnectbackend" }],
  },
];

export const SKILL_GROUPS: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL"] },
  { title: "Backend", items: ["Node.js", "Express.js", "Fastify", "FastAPI", "REST APIs", "MVC"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Supabase", "SQLAlchemy", "Alembic"] },
  { title: "Payments & Cloud", items: ["Razorpay", "Redis", "Cloudflare R2"] },
  { title: "DevOps & Tools", items: ["Docker", "Render", "Git", "Linux", "Postman", "VS Code"] },
  { title: "Testing", items: ["Vitest", "pytest"] },
  { title: "AI / ML", items: ["Recommendation systems", "TF-IDF", "Cosine similarity"] },
  { title: "Frontend / Mobile", items: ["React", "Flutter", "Android"] },
  { title: "Fundamentals", items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"] },
];

export const CURRENTLY = [
  { label: "Studying", value: "MCA Cyber Security, final year — Galgotias University" },
  { label: "Working", value: "Backend Intern — Aarogya Virohan" },
  { label: "Next", value: "Going deeper into security (GRC & VAPT)" },
];

export const ABOUT_STORY = [
  "I'm a full stack developer from Greater Noida who likes systems that actually ship.",
  "I build backends that handle real money and real users: payments, bookings, auth — the unglamorous parts that have to work.",
  "Right now I'm finishing my MCA in Cyber Security, and going deeper into the security side of everything I build.",
];
