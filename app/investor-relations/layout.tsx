import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Relations - SprintiQ",
  description: "SprintiQ Investor Relations page",
  keywords: [
    "SprintiQ",
    "Investor Relations",
    "SprintiQ Investor Relations",
    "SprintiQ Investor Relations Page",
  ],
  openGraph: {
    title: "SprintiQ Investor Relations",
    description: "SprintiQ Investor Relations page",
    url: "https://www.sprintiq.ai/investor-relations",
    siteName: "SprintiQ",
    images: [{ url: "/og-image.png" }],
  },
};

export default function InvestorRelationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
