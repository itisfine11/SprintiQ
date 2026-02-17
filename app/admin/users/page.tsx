import AdminLayout from "@/components/admin/layout";
import AdminUsersClient from "@/components/admin/users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - SprintiQ",
  description: "SprintiQ Users page",
};

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <AdminUsersClient />
    </AdminLayout>
  );
}
