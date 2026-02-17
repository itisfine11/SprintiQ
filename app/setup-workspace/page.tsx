import SetupWorkspaceForm from "@/components/workspace/forms/setup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Workspace - SprintiQ",
  description: "SprintiQ Setup Workspace page",
};

export default function SetupWorkspacePage() {
  return (
    <div className="py-8">
      <SetupWorkspaceForm />
    </div>
  );
}
