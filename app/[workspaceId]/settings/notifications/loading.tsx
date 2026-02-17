import { Inbox, Mail, Monitor } from "lucide-react";
import SlackSvg from "@/components/svg/apps/SlackSvg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification Settings - SprintiQ",
  description: "SprintiQ Notification settings page",
};

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <p className="text-sm text-muted-foreground">
            Learn more about customizing your notifications.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Inbox Notifications */}
        <div className="flex items-center justify-between rounded-lg border workspace-border p-4">
          <div className="flex items-center gap-3">
            <Inbox className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">Inbox</p>
              <p className="text-xs text-muted-foreground">
                No notifications will be sent to your inbox
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border workspace-border p-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-muted-foreground">
                No notifications will be sent to your email
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border workspace-border p-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">Browser</p>
              <p className="text-xs text-muted-foreground">
                Browser notifications are enabled
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-8 workspace-border" />

      {/* Integrations */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold">Integrations</h3>
      </div>
      <div className="flex items-center justify-between rounded-lg border workspace-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5">
            <SlackSvg />
          </div>
          <div>
            <p className="font-medium text-sm">Slack</p>
            <p className="text-xs text-muted-foreground">
              Connected to Slack workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
