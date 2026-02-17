import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SprintiQ | AI-Native Agile Planning Company",
  description:
    "Learn about SprintiQ, the #1 AI-Native agile planning company. Discover how we're revolutionizing AI project management with AI sprint planning and AI user story generation.",
  keywords: [
    "About SprintiQ",
    "about sprintiq",
    "SprintiQ Company",
    "sprintiq company",
    "SprintiQ AI Company",
    "sprintiq ai company",
    "SprintiQ AI Native Company",
    "sprintiq ai native company",
    "AI Native Agile Planning Company",
    "ai native agile planning company",
    "AI Project Management Company",
    "ai project management company",
    "AI Sprint Planning Company",
    "ai sprint planning company",
    "AI User Story Generation Company",
    "ai user story generation company",
    "SprintiQ",
    "sprintiq",
    "SprintiQ AI",
    "sprintiq ai",
    "AI Native Project management",
    "AI Native Project Management",
    "ai native project management",
    "AI project management",
    "ai project management",
    "AI agile planning",
    "ai agile planning",
    "AI native agile",
    "ai native agile",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "About SprintiQ | AI-Native Agile Planning Company",
    description:
      "Learn about SprintiQ, the #1 AI-Native agile planning company. Discover how we're revolutionizing AI project management with AI sprint planning and AI user story generation.",
    url: "https://www.sprintiq.ai/about",
    siteName: "SprintiQ",
    images: [{ url: "/images/about.png" }],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
