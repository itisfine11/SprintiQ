import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - SprintiQ",
  description: "SprintiQ Support page",
  keywords: [
    "SprintiQ Support",
    "SprintiQ Support Page",
    "sprintiq support",
    "sprintiq support page",
    "sprintiq ai",
    "sprintiq ai support",
    "sprintiq ai support page",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SprintiQ Support",
    description: "SprintiQ Support page",
    url: "https://www.sprintiq.ai/support",
    siteName: "SprintiQ",
    images: [{ url: "/og-image.png" }],
  },
};

export default function SLALayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
