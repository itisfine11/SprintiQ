import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox - SprintiQ",
  description: "Manage your inbox and your SprintiQ tasks.",
};

interface InboxLayoutProps {
  children: React.ReactNode;
}

export default function InboxLayout({ children }: InboxLayoutProps) {
  return children;
}
