import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - SprintiQ | AI-Native Agile Planning Tool",
  description:
    "Sign in to SprintiQ - AI-Native agile planning tool. Access AI project management, AI sprint planning, and AI user story generation features.",
  keywords: [
    "SprintiQ Sign In",
    "sprintiq signin",
    "SprintiQ Login",
    "sprintiq login",
    "SprintiQ AI Sign In",
    "sprintiq ai signin",
    "SprintiQ AI Login",
    "sprintiq ai login",
    "AI Native Agile Planning Sign In",
    "ai native agile planning signin",
    "AI Project Management Sign In",
    "ai project management signin",
    "AI Sprint Planning Sign In",
    "ai sprint planning signin",
    "AI User Story Generation Sign In",
    "ai user story generation signin",
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
    "Sign in",
    "sign in",
    "Login",
    "login",
    "User authentication",
    "user authentication",
    "Account access",
    "account access",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sign In - SprintiQ | AI-Native Agile Planning Tool",
    description:
      "Sign in to SprintiQ - AI-Native agile planning tool. Access AI project management, AI sprint planning, and AI user story generation features.",
    url: "https://www.sprintiq.ai/signin",
    siteName: "SprintiQ",
    images: [{ url: "/images/signin.png" }],
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
