import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - SprintiQ",
  description: "SprintiQ Admin Dashboard page",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
