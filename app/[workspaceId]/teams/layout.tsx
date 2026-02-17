import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams - SprintiQ",
  description: "Manage your SprintiQ teams and their members.",
};

interface TeamsLayoutProps {
  children: React.ReactNode;
}

export default function TeamsLayout({ children }: TeamsLayoutProps) {
  return children;
}
