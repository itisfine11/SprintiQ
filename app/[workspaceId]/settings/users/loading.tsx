import { CheckCircle, Clock, Crown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users - SprintiQ",
  description: "SprintiQ Users page",
};

export default function UsersLoading() {
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage workspace members and their permissions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="workspace-header-bg border workspace-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="workspace-header-bg border workspace-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Invites
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="workspace-header-bg border workspace-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Admins & Owners
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="workspace-header-bg border workspace-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse" />
              <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="workspace-header-bg border workspace-border">
          <CardHeader>
            <CardTitle>Members </CardTitle>
            <CardDescription>
              Manage your workspace members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center w-full justify-between p-4 border workspace-border rounded-lg hover:workspace-hover transition-colors">
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="w-64 h-4 bg-gray-200 rounded-md animate-pulse" />
                    <div className="w-32 h-2 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center w-full justify-between p-4 border workspace-border rounded-lg hover:workspace-hover transition-colors">
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="w-64 h-4 bg-gray-200 rounded-md animate-pulse" />
                    <div className="w-32 h-2 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center w-full justify-between p-4 border workspace-border rounded-lg hover:workspace-hover transition-colors">
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="w-64 h-4 bg-gray-200 rounded-md animate-pulse" />
                    <div className="w-32 h-2 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
