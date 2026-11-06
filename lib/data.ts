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

/**
 * The Path, as Timeline milestones — the same horizontal scrub animation as
 * the project pages, fed with the real journey (degrees, internships,
 * production systems) instead of the component's demo 2020–2026 storyline.
 */
export const PATH_TIMELINE: { top: TimelineItem[]; bottom: TimelineItem[] } = {
  top: [
    { id: "path-bca", year: "2022", month: "August", content: "BCA, Computer Science — Agra University. CS fundamentals, DSA, and the first lines of code that stuck." },
    { id: "path-mca", year: "2025", month: "August", content: "MCA, Cyber Security — Galgotias University. Final year, going deep on security — GRC and VAPT direction." },
    { id: "path-aarogya", year: "2026", month: "April", content: "Backend Developer Intern — Aarogya Virohan. Health-tech APIs with FastAPI + PostgreSQL, JWT auth with clinic-isolation middleware." },
  ],
  bottom: [
    { id: "path-freelance", year: "2026", month: "August", content: "Freelance Backend Developer — tour & travel business. Production Fastify backend: fares, bookings, Razorpay, Dockerized on Render." },
    { id: "path-arenaai", year: "2026", month: "October", content: "ArenaAI shipped — production travel platform. Live bookings, SEO pipeline, Cloudflare deploys." },
    { id: "path-now", year: "2026", month: "November", content: "Building in public — open to work. Shipping, learning security, and looking for what's next." },
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

// ARSENAL sphere: one node per technology. Brand icons are
// self-hosted Simple Icons (CC0) in public/icons/tech; concepts with no brand
// logo use a burnt-orange letter tile. Clicking a node opens its write-up.
export const TECH_SPHERE: { id: string; src: string; alt: string; title: string; description: string }[] = [
  { id: "javascript", src: "/icons/tech/javascript.svg", alt: "JavaScript", title: "JavaScript", description: "The base language — Node services, React pages, and this portfolio." },
  { id: "typescript", src: "/icons/tech/typescript.svg", alt: "TypeScript", title: "TypeScript", description: "The production travel backend — Fastify, fares, bookings, Razorpay." },
  { id: "python", src: "/icons/tech/python.svg", alt: "Python", title: "Python", description: "FastAPI backends and the CineMatch recommender." },
  { id: "sql", src: "/icons/tech/tile-sql.svg", alt: "SQL", title: "SQL", description: "The queries behind bookings, clinic records, and attendance." },
  { id: "nodejs", src: "/icons/tech/nodedotjs.svg", alt: "Node.js", title: "Node.js", description: "Express and Fastify services, live on Render." },
  { id: "express", src: "/icons/tech/express.svg", alt: "Express.js", title: "Express.js", description: "FreeTune's music-streaming backend." },
  { id: "fastify", src: "/icons/tech/fastify.svg", alt: "Fastify", title: "Fastify", description: "ArenaAI's production backend — routes, fares, payments." },
  { id: "fastapi", src: "/icons/tech/fastapi.svg", alt: "FastAPI", title: "FastAPI", description: "Health-tech APIs at Aarogya Virohan, and CineMatch." },
  { id: "rest-apis", src: "/icons/tech/tile-api.svg", alt: "REST APIs", title: "REST APIs", description: "The contract every frontend and service talks through." },
  { id: "mvc", src: "/icons/tech/tile-mvc.svg", alt: "MVC", title: "MVC", description: "The shape I keep backends in — routes, logic, data." },
  { id: "postgresql", src: "/icons/tech/postgresql.svg", alt: "PostgreSQL", title: "PostgreSQL", description: "Clinic data, travel bookings, and the auction store." },
  { id: "mongodb", src: "/icons/tech/mongodb.svg", alt: "MongoDB", title: "MongoDB", description: "Travel data and FreeTune's catalogue." },
  { id: "mysql", src: "/icons/tech/mysql.svg", alt: "MySQL", title: "MySQL", description: "SmartCampus attendance records." },
  { id: "sqlite", src: "/icons/tech/sqlite.svg", alt: "SQLite", title: "SQLite", description: "CineMatch's local ranking store." },
  { id: "supabase", src: "/icons/tech/supabase.svg", alt: "Supabase", title: "Supabase", description: "Postgres with auth — the travel backend and the auction's future store." },
  { id: "sqlalchemy", src: "/icons/tech/sqlalchemy.svg", alt: "SQLAlchemy", title: "SQLAlchemy", description: "The ORM behind the clinic backend." },
  { id: "alembic", src: "/icons/tech/tile-alembic.svg", alt: "Alembic", title: "Alembic", description: "Migrations for the clinic database." },
  { id: "razorpay", src: "/icons/tech/razorpay.svg", alt: "Razorpay", title: "Razorpay", description: "Real money — travel bookings, live in production." },
  { id: "redis", src: "/icons/tech/redis.svg", alt: "Redis", title: "Redis", description: "Caching and rate limits for FreeTune." },
  { id: "cloudflare-r2", src: "/icons/tech/cloudflare.svg", alt: "Cloudflare R2", title: "Cloudflare R2", description: "Audio for FreeTune, deploys for this portfolio." },
  { id: "docker", src: "/icons/tech/docker.svg", alt: "Docker", title: "Docker", description: "Every backend ships in a container." },
  { id: "render", src: "/icons/tech/render.svg", alt: "Render", title: "Render", description: "Where the backends live." },
  { id: "git", src: "/icons/tech/git.svg", alt: "Git", title: "Git", description: "Everything versioned — every push reviewed live." },
  { id: "linux", src: "/icons/tech/linux.svg", alt: "Linux", title: "Linux", description: "Home turf — Bandit levels, servers, and the local AI box." },
  { id: "postman", src: "/icons/tech/postman.svg", alt: "Postman", title: "Postman", description: "APIs tested before they ship." },
  { id: "vscode", src: "/icons/tech/visualstudiocode.svg", alt: "VS Code", title: "VS Code", description: "The editor." },
  { id: "vitest", src: "/icons/tech/vitest.svg", alt: "Vitest", title: "Vitest", description: "Tests for the TypeScript backend." },
  { id: "pytest", src: "/icons/tech/pytest.svg", alt: "pytest", title: "pytest", description: "Tests for the FastAPI services." },
  { id: "recommenders", src: "/icons/tech/tile-ml.svg", alt: "Recommendation systems", title: "Recommendation systems", description: "CineMatch — TF-IDF and cosine similarity over movie text." },
  { id: "tfidf", src: "/icons/tech/tile-tfidf.svg", alt: "TF-IDF", title: "TF-IDF", description: "How CineMatch weighs what makes a movie distinct." },
  { id: "cosine", src: "/icons/tech/tile-cosine.svg", alt: "Cosine similarity", title: "Cosine similarity", description: "How CineMatch measures one movie against another." },
  { id: "react", src: "/icons/tech/react.svg", alt: "React", title: "React", description: "This portfolio, CineMatch, and ArenaAI's frontend." },
  { id: "flutter", src: "/icons/tech/flutter.svg", alt: "Flutter", title: "Flutter", description: "SmartCampus, cross-platform." },
  { id: "android", src: "/icons/tech/android.svg", alt: "Android", title: "Android", description: "APK reverse engineering — learning the platform from the inside." },
  { id: "dsa", src: "/icons/tech/tile-dsa.svg", alt: "DSA", title: "DSA", description: "The practice behind every interview and every faster query." },
  { id: "oop", src: "/icons/tech/tile-oop.svg", alt: "OOP", title: "OOP", description: "The design habit — small classes, clear owners." },
  { id: "dbms", src: "/icons/tech/tile-dbms.svg", alt: "DBMS", title: "DBMS", description: "The theory behind the databases I run in production." },
  { id: "os", src: "/icons/tech/tile-os.svg", alt: "Operating Systems", title: "Operating Systems", description: "The layer under everything — processes, memory, scheduling." },
  { id: "networks", src: "/icons/tech/tile-networks.svg", alt: "Computer Networks", title: "Computer Networks", description: "How requests actually travel — DNS to TLS to the load balancer." },
];

// main3 hero: screenshots of Tarun's own project pages, captured
// from the local build. Each tile links to its project page.
export const HERO_TILES: { id: string; src: string; alt: string; name: string; stack: string; href: string }[] = [
  { id: "arenaai", src: "/hero-pages/arenaai.jpg", alt: "ArenaAI project page", name: "ArenaAI", stack: "TypeScript · Fastify · PostgreSQL", href: "/projects/arenaai" },
  { id: "cinematch", src: "/hero-pages/cinematch.jpg", alt: "CineMatch project page", name: "CineMatch", stack: "React · FastAPI · TF-IDF", href: "/projects/cinematch" },
  { id: "freetune", src: "/hero-pages/freetune.jpg", alt: "FreeTune project page", name: "FreeTune", stack: "Node.js · Express · Redis", href: "/projects/freetune" },
  { id: "smartcampus", src: "/hero-pages/smartcampus.jpg", alt: "SmartCampus project page", name: "SmartCampus", stack: "Flutter · Node.js · MySQL", href: "/projects/smartcampus" },
  { id: "bloodconnect", src: "/hero-pages/bloodconnect.jpg", alt: "BloodConnect project page", name: "BloodConnect", stack: "JavaScript · Node.js", href: "/projects/bloodconnect" },
];

// main3 hero portrait: Tarun's own smile close-up (sunglasses), used as the
// full-bleed portrait in the intro panel. Also preloaded in app/layout.tsx.
export const HERO_PORTRAIT = "/photos/tarun-smile-closeup.jpg";

export const ABOUT_STORY = [
  "Full stack developer — Greater Noida.",
  "I build backends for real money and real users.",
  "MCA Cyber Security — going deeper into security.",
];
