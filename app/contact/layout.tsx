import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "Contact SprintiQ for AI-Native agile planning support. Get help with AI project management, AI sprint planning, and AI user story generation tools.",
  keywords: [
    "SprintiQ Contact",
    "sprintiq contact",
    "SprintiQ Contact Page",
    "sprintiq contact page",
    "SprintiQ AI Contact",
    "sprintiq ai contact",
    "SprintiQ AI Contact Page",
    "sprintiq ai contact page",
    "AI Native Agile Planning Contact",
    "ai native agile planning contact",
    "AI Project Management Contact",
    "ai project management contact",
    "AI Sprint Planning Contact",
    "ai sprint planning contact",
    "AI User Story Generation Contact",
    "ai user story generation contact",
    "SprintiQ Support",
    "sprintiq support",
    "SprintiQ Help",
    "sprintiq help",
    "SprintiQ Customer Service",
    "sprintiq customer service",
    "SprintiQ Technical Support",
    "sprintiq technical support",
    "Contact Us",
    "contact us",
    "Get Help",
    "get help",
    "Support Team",
    "support team",
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
    "Customer Support",
    "customer support",
    "Help Desk",
    "help desk",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact - SprintiQ | AI-Native Agile Planning Tool",
    description:
      "Contact SprintiQ for AI-Native agile planning support. Get help with AI project management, AI sprint planning, and AI user story generation tools.",
    url: "https://www.sprintiq.ai/contact",
    siteName: "SprintiQ",
    images: [{ url: "/images/contact.png" }],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
