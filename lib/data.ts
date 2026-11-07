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
  { value: 39, suffix: "", label: "technologies" },
  { value: 2, suffix: "", label: "production systems live" },
  { value: 4, suffix: "", label: "years coding" },
];


export const projectSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * The Path, as Timeline milestones — the same horizontal scrub animation as
 * the project pages, fed with the real journey (degrees, internships,
 * production systems) instead of the component's demo 2020–2026 storyline.
 */
export const PATH_TIMELINE: { top: TimelineItem[]; bottom: TimelineItem[] } = {
  top: [
    { id: "path-bca", year: "2022", month: "August", content: "BCA, Computer Science — Agra University." },
    { id: "path-mca", year: "2025", month: "August", content: "MCA, Cyber Security — Galgotias University." },
    { id: "path-aarogya", year: "2026", month: "April", content: "Backend Developer Intern — Aarogya Virohan. Health-tech APIs." },
  ],
  bottom: [
    { id: "path-freelance", year: "2026", month: "August", content: "Freelance Backend Developer — tour & travel business." },
    { id: "path-arenaai", year: "2026", month: "October", content: "ArenaAI shipped — production travel platform." },
    { id: "path-now", year: "2026", month: "November", content: "Building in public — open to work." },
  ],
};

export interface Project {
  name: string;
  outcome: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
  video?: string;
  videoId?: string;
  points: string[];
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
      "Full SEO pipeline — SSG, sitemap, canonicals, and Cloudflare deploys",
      "Hardened production backend — rate-limited, Dockerized, handling real money",
    ],
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
      "Node.js and Express with MongoDB and Redis under the hood",
      "Audio served fast from Cloudflare R2",
    ],
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "CineMatch",
    outcome: "Full-stack movie recommendations with content-based filtering (TF-IDF + cosine similarity).",
    stack: ["React", "FastAPI", "scikit-learn", "SQLite"],
    image: "/photos/projects/cinematch-cinema.webp",
    imageAlt: "Empty cinema theater seats",
    points: [
      "React frontend talking to a FastAPI backend",
      "Scikit-learn ranking over a SQLite store",
    ],
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "SmartCampus",
    outcome: "Cross-platform attendance app for institutions — recording, teacher workflows, analytics.",
    stack: ["Flutter", "Node.js", "MySQL"],
    image: "/photos/projects/smartcampus-campus.webp",
    imageAlt: "University campus",
    points: [
      "Teacher workflows with recording and analytics",
      "Flutter frontend, Node.js and MySQL backend",
    ],
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia" }],
  },
  {
    name: "BloodConnect",
    outcome: "Production-ready backend for a blood-donation connect app.",
    stack: ["JavaScript", "Node.js"],
    image: "/photos/projects/bloodconnect-donation.webp",
    imageAlt: "Blood bags ready for donation",
    points: [
      "Production-ready Node.js service",
      "Built to connect donors with people who need blood",
    ],
    links: [{ label: "GitHub", href: "https://github.com/tarun1sisodia/bloodconnectbackend" }],
  },
];

// ARSENAL sphere: one node per technology. Brand icons are
// self-hosted Simple Icons (CC0) in public/icons/tech; concepts with no brand
// logo use a burnt-orange letter tile. Clicking a node opens its write-up.
export const TECH_SPHERE: { id: string; src: string; alt: string; title: string; description?: string }[] = [
  { id: "javascript", src: "/icons/tech/javascript.svg", alt: "JavaScript", title: "JavaScript" },
  { id: "typescript", src: "/icons/tech/typescript.svg", alt: "TypeScript", title: "TypeScript", description: "The production travel backend — Fastify, fares, bookings, Razorpay." },
  { id: "python", src: "/icons/tech/python.svg", alt: "Python", title: "Python", description: "FastAPI backends and the CineMatch recommender." },
  { id: "sql", src: "/icons/tech/tile-sql.svg", alt: "SQL", title: "SQL" },
  { id: "nodejs", src: "/icons/tech/nodedotjs.svg", alt: "Node.js", title: "Node.js", description: "Express and Fastify services, live on Render." },
  { id: "express", src: "/icons/tech/express.svg", alt: "Express.js", title: "Express.js" },
  { id: "fastify", src: "/icons/tech/fastify.svg", alt: "Fastify", title: "Fastify", description: "ArenaAI's production backend — routes, fares, payments." },
  { id: "fastapi", src: "/icons/tech/fastapi.svg", alt: "FastAPI", title: "FastAPI", description: "Health-tech APIs at Aarogya Virohan, and CineMatch." },
  { id: "rest-apis", src: "/icons/tech/tile-api.svg", alt: "REST APIs", title: "REST APIs" },
  { id: "mvc", src: "/icons/tech/tile-mvc.svg", alt: "MVC", title: "MVC" },
  { id: "postgresql", src: "/icons/tech/postgresql.svg", alt: "PostgreSQL", title: "PostgreSQL", description: "Clinic data, travel bookings, and the auction store." },
  { id: "mongodb", src: "/icons/tech/mongodb.svg", alt: "MongoDB", title: "MongoDB" },
  { id: "mysql", src: "/icons/tech/mysql.svg", alt: "MySQL", title: "MySQL" },
  { id: "sqlite", src: "/icons/tech/sqlite.svg", alt: "SQLite", title: "SQLite" },
  { id: "supabase", src: "/icons/tech/supabase.svg", alt: "Supabase", title: "Supabase" },
  { id: "sqlalchemy", src: "/icons/tech/sqlalchemy.svg", alt: "SQLAlchemy", title: "SQLAlchemy" },
  { id: "alembic", src: "/icons/tech/tile-alembic.svg", alt: "Alembic", title: "Alembic" },
  { id: "razorpay", src: "/icons/tech/razorpay.svg", alt: "Razorpay", title: "Razorpay", description: "Real money — travel bookings, live in production." },
  { id: "redis", src: "/icons/tech/redis.svg", alt: "Redis", title: "Redis", description: "Caching and rate limits for FreeTune." },
  { id: "cloudflare-r2", src: "/icons/tech/cloudflare.svg", alt: "Cloudflare R2", title: "Cloudflare R2" },
  { id: "docker", src: "/icons/tech/docker.svg", alt: "Docker", title: "Docker", description: "Every backend ships in a container." },
  { id: "render", src: "/icons/tech/render.svg", alt: "Render", title: "Render" },
  { id: "git", src: "/icons/tech/git.svg", alt: "Git", title: "Git" },
  { id: "linux", src: "/icons/tech/linux.svg", alt: "Linux", title: "Linux" },
  { id: "postman", src: "/icons/tech/postman.svg", alt: "Postman", title: "Postman" },
  { id: "vscode", src: "/icons/tech/visualstudiocode.svg", alt: "VS Code", title: "VS Code" },
  { id: "vitest", src: "/icons/tech/vitest.svg", alt: "Vitest", title: "Vitest" },
  { id: "pytest", src: "/icons/tech/pytest.svg", alt: "pytest", title: "pytest" },
  { id: "recommenders", src: "/icons/tech/tile-ml.svg", alt: "Recommendation systems", title: "Recommendation systems" },
  { id: "tfidf", src: "/icons/tech/tile-tfidf.svg", alt: "TF-IDF", title: "TF-IDF" },
  { id: "cosine", src: "/icons/tech/tile-cosine.svg", alt: "Cosine similarity", title: "Cosine similarity" },
  { id: "react", src: "/icons/tech/react.svg", alt: "React", title: "React", description: "This portfolio, CineMatch, and ArenaAI's frontend." },
  { id: "flutter", src: "/icons/tech/flutter.svg", alt: "Flutter", title: "Flutter" },
  { id: "android", src: "/icons/tech/android.svg", alt: "Android", title: "Android" },
  { id: "dsa", src: "/icons/tech/tile-dsa.svg", alt: "DSA", title: "DSA" },
  { id: "oop", src: "/icons/tech/tile-oop.svg", alt: "OOP", title: "OOP" },
  { id: "dbms", src: "/icons/tech/tile-dbms.svg", alt: "DBMS", title: "DBMS" },
  { id: "os", src: "/icons/tech/tile-os.svg", alt: "Operating Systems", title: "Operating Systems" },
  { id: "networks", src: "/icons/tech/tile-networks.svg", alt: "Computer Networks", title: "Computer Networks" },
];

// main3 hero: screenshots of Tarun's own project pages, captured
// from the local build. Each tile links to its project page.
export const HERO_TILES: { id: string; src: string; alt: string; name: string; stack: string; href: string; line: string }[] = [
  { id: "arenaai", src: "/hero-pages/arenaai.jpg", alt: "SK Baghel travel site homepage", name: "ArenaAI", stack: "TypeScript · Fastify · PostgreSQL", href: "/projects/arenaai", line: "The travel business backend — live bookings, Razorpay, real users." },
  { id: "cinematch", src: "/hero-pages/cinematch.jpg", alt: "Empty cinema theater seats", name: "CineMatch", stack: "React · FastAPI · TF-IDF", href: "/projects/cinematch", line: "Movie recommendations — TF-IDF and cosine similarity, React + FastAPI." },
  { id: "freetune", src: "/hero-pages/freetune.jpg", alt: "Concert crowd under stage lights", name: "FreeTune", stack: "Node.js · Express · Redis", href: "/projects/freetune", line: "Music streaming backend — Node.js, Redis caching, Cloudflare R2." },
  { id: "smartcampus", src: "/hero-pages/smartcampus.jpg", alt: "University of Toronto back campus", name: "SmartCampus", stack: "Flutter · Node.js · MySQL", href: "/projects/smartcampus", line: "Attendance app for institutions — Flutter, Node.js, MySQL." },
  { id: "bloodconnect", src: "/hero-pages/bloodconnect.jpg", alt: "Platelet donation in progress", name: "BloodConnect", stack: "JavaScript · Node.js", href: "/projects/bloodconnect", line: "Blood donation, connected — find donors when it matters." },
];

// main3 hero portrait: Tarun's arms-crossed smile (sunglasses), cut out
// from its background (rembg u2net). Chosen 2026-11-06 because it is the
// sharpest portrait available: face sharpness ~3x the smile close-up it
// replaces, face 360px wide natively so it renders without upscaling.
// Also preloaded in app/layout.tsx.
export const HERO_PORTRAIT = "/photos/tarun-arms-crossed-cutout.png";

export const ABOUT_STORY = [
  "Full stack developer — Greater Noida.",
  "I build backends for real money and real users.",
  "MCA Cyber Security — going deeper into security.",
];
