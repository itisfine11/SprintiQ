import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SprintiQ",
  description: "SprintiQ Terms of Service page",
  keywords: ["SprintiQ", "Terms of Service", "SprintiQ Terms of Service"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SprintiQ Terms of Service",
    description: "SprintiQ Terms of Service page",
    url: "https://www.sprintiq.ai/terms",
    siteName: "SprintiQ",
    images: [{ url: "/og-image.png" }],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
