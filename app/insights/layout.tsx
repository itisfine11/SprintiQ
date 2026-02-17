import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights - SprintiQ",
  description: "SprintiQ Insights page",
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
