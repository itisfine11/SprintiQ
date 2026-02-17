import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "Discover SprintiQ's AI-Native agile planning features. AI sprint planning, AI user story generation, AI project management, and AI native agile development tools.",
  keywords: [
    "SprintiQ Features",
    "sprintiq features",
    "SprintiQ AI Features",
    "sprintiq ai features",
    "SprintiQ AI Native Features",
    "sprintiq ai native features",
    "AI Native Agile Planning Features",
    "ai native agile planning features",
    "AI Project Management Features",
    "ai project management features",
    "AI Sprint Planning Features",
    "ai sprint planning features",
    "AI User Story Generation Features",
    "ai user story generation features",
    "AI Native Agile Development Features",
    "ai native agile development features",
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
    title: "SprintiQ Features | AI-Native Agile Planning",
    description:
      "Discover SprintiQ's AI-Native agile planning features. AI sprint planning, AI user story generation, AI project management, and AI native agile development tools.",
    url: "https://www.sprintiq.ai/features",
    siteName: "SprintiQ",
    images: [{ url: "/og-image.png" }],
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
