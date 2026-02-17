import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "Sign up for SprintiQ - AI-Native agile planning tool. Get free early access to AI project management, AI sprint planning, and AI user story generation features.",
  keywords: [
    "SprintiQ Sign Up",
    "sprintiq signup",
    "SprintiQ Sign Up Page",
    "sprintiq signup page",
    "SprintiQ AI Sign Up",
    "sprintiq ai signup",
    "SprintiQ AI Sign Up Page",
    "sprintiq ai signup page",
    "AI Native Agile Planning Sign Up",
    "ai native agile planning signup",
    "AI Project Management Sign Up",
    "ai project management signup",
    "AI Sprint Planning Sign Up",
    "ai sprint planning signup",
    "AI User Story Generation Sign Up",
    "ai user story generation signup",
    "Free Early Access Sign Up",
    "free early access signup",
    "Beta Access Sign Up",
    "beta access signup",
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
    "Sign up",
    "sign up",
    "Registration",
    "registration",
    "Create account",
    "create account",
    "Join SprintiQ",
    "join sprintiq",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sign Up - SprintiQ | AI-Native Agile Planning Tool",
    description:
      "Sign up for SprintiQ - AI-Native agile planning tool. Get free early access to AI project management, AI sprint planning, and AI user story generation features.",
    url: "https://www.sprintiq.ai/signup",
    siteName: "SprintiQ",
    images: [{ url: "/images/signup.png" }],
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
