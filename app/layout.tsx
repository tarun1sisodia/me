import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_TITLE = "Tarun Sisodia — Full Stack Developer";
const SITE_DESC =
  "Tarun Sisodia is a full stack developer from Greater Noida building production systems — APIs, payments, platforms. MCA Cyber Security @ Galgotias University.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESC,
  authors: [{ name: "Tarun Sisodia" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060B",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tarun Sisodia",
  jobTitle: "Full Stack Developer",
  address: { "@type": "PostalAddress", addressLocality: "Greater Noida", addressCountry: "IN" },
  email: "mailto:coccoder999@gmail.com",
  sameAs: [
    "https://github.com/tarun1sisodia",
    "https://linkedin.com/in/tarun1sisodia",
    "https://instagram.com/tarun1sisodia",
    "https://x.com/tarun1sisodia",
  ],
  knowsAbout: [
    "TypeScript",
    "Python",
    "FastAPI",
    "Fastify",
    "PostgreSQL",
    "MongoDB",
    "React",
    "Docker",
    "Cybersecurity",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
