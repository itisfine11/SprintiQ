import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SLA - SprintiQ",
  description: "SprintiQ SLA page",
  keywords: [
    "SprintiQ SLA",
    "SprintiQ SLA Policy",
    "SprintiQ SLA Policy Page",
    "sprintiq sla",
    "sprintiq sla policy",
    "sprintiq sla policy page",
    "sprintiq ai",
    "sprintiq ai privacy",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SprintiQ SLA",
    description: "SprintiQ SLA page",
    url: "https://www.sprintiq.ai/sla",
    siteName: "SprintiQ",
    images: [{ url: "/og-image.png" }],
  },
};

export default function SLALayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
