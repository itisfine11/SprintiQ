import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "SprintiQ pricing plans for AI-Native agile planning. Free early access, AI project management, AI sprint planning, and AI user story generation tools.",
  keywords: [
    "SprintiQ Pricing",
    "sprintiq pricing",
    "SprintiQ AI Pricing",
    "sprintiq ai pricing",
    "SprintiQ AI Native Pricing",
    "sprintiq ai native pricing",
    "AI Native Agile Planning Pricing",
    "ai native agile planning pricing",
    "AI Project Management Pricing",
    "ai project management pricing",
    "AI Sprint Planning Pricing",
    "ai sprint planning pricing",
    "AI User Story Generation Pricing",
    "ai user story generation pricing",
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
    "Free early access",
    "free early access",
    "Beta access",
    "beta access",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SprintiQ Pricing | AI-Native Agile Planning Tool",
    description:
      "SprintiQ pricing plans for AI-Native agile planning. Free early access, AI project management, AI sprint planning, and AI user story generation tools.",
    url: "https://www.sprintiq.ai/pricing",
    siteName: "SprintiQ",
    images: [{ url: "/images/pricing.png" }],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
