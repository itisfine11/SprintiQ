import AdminLayout from "@/components/admin/layout";
import AdminInsightsClient from "@/components/admin/insights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights - SprintiQ",
  description: "SprintiQ Insights page",
};

export default function AdminInsightsPage() {
  return (
    <AdminLayout>
      <AdminInsightsClient />
    </AdminLayout>
  );
}
