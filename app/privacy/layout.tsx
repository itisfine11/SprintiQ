import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "SprintiQ privacy policy and data protection for AI-Native agile planning. Learn how we protect your data in AI project management and AI sprint planning.",
  keywords: [
    "SprintiQ Privacy",
    "sprintiq privacy",
    "SprintiQ Privacy Policy",
    "sprintiq privacy policy",
    "SprintiQ Privacy Policy Page",
    "sprintiq privacy policy page",
    "SprintiQ AI Privacy",
    "sprintiq ai privacy",
    "SprintiQ AI Privacy Policy",
    "sprintiq ai privacy policy",
    "AI Native Agile Planning Privacy",
    "ai native agile planning privacy",
    "AI Project Management Privacy",
    "ai project management privacy",
    "AI Sprint Planning Privacy",
    "ai sprint planning privacy",
    "AI User Story Generation Privacy",
    "ai user story generation privacy",
    "Data Protection",
    "data protection",
    "Privacy Policy",
    "privacy policy",
    "Data Security",
    "data security",
    "User Privacy",
    "user privacy",
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
    "GDPR Compliance",
    "gdpr compliance",
    "Data Privacy",
    "data privacy",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy - SprintiQ | AI-Native Agile Planning Tool",
    description:
      "SprintiQ privacy policy and data protection for AI-Native agile planning. Learn how we protect your data in AI project management and AI sprint planning.",
    url: "https://www.sprintiq.ai/privacy",
    siteName: "SprintiQ",
    images: [{ url: "/images/privacy.png" }],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
