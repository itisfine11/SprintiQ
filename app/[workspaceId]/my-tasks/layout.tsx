import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks - SprintiQ",
  description: "Manage your tasks and your SprintiQ projects.",
};

interface MyTasksLayoutProps {
  children: React.ReactNode;
}

export default function MyTasksLayout({ children }: MyTasksLayoutProps) {
  return children;
}
