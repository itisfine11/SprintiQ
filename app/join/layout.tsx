import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join - SprintiQ",
  description: "SprintiQ Join page",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
