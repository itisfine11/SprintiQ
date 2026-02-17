"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();
  const supabase = createClientSupabaseClient();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<any>(null);

  useEffect(() => {
    const verifyInvite = async () => {
      try {
        if (!token) {
          setError("Invalid invitation link");
          return;
        }

        console.log("token", token);

        // Verify invite via server (bypasses RLS and handles 0-row cases)
        const verifyRes = await fetch(
          `/api/workspace/verify-invite?token=${encodeURIComponent(token)}`
        );

        if (!verifyRes.ok) {
          setError("This invitation is no longer valid");
          return;
        }
        const { data: invite } = await verifyRes.json();

        console.log("invite", invite);
        console.log("token", token);

        setInviteData(invite);

        // If user is logged in, check if it matches the invite
        if (user) {
          const loggedInEmail = user.email?.toLowerCase();
          const invitedEmail = (invite as any)?.email?.toLowerCase();

          if (loggedInEmail && invitedEmail && loggedInEmail === invitedEmail) {
            // Accept the invitation automatically
            await acceptInvitation(invite);
          } else {
            setError("This invitation was sent to a different email address");
          }
        }
      } catch (err: any) {
        console.error("Error verifying invite:", err);
        setError("Failed to verify invitation");
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvite();
  }, [token, user]);

  const acceptInvitation = async (invite: any) => {
    try {
      // Accept via server to avoid RLS issues
      const res = await fetch("/api/workspace/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId: invite.id, userId: user?.id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to accept invitation");
      }

      // Redirect to the workspace
      const publicWorkspaceId = invite?.workspaces?.workspace_id;
      if (publicWorkspaceId) {
        router.push(`/${publicWorkspaceId}/home`);
      } else {
        // Fallback: go to generic workspaces page
        router.push("/workspace");
      }
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept invitation");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/workspace")}
            >
              Go to Workspaces
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join {inviteData?.workspaces?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Sign in or create an account to accept this invitation.
            </p>
            <Button
              className="w-full"
              onClick={() =>
                router.push(`/signin?redirect=/join?token=${token}`)
              }
            >
              Sign In or Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Joining Workspace...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Please wait while we process your invitation...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
