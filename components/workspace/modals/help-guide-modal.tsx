"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGuide } from "../guided-tour/guide-provider";
import { useParams, useRouter } from "next/navigation";

interface HelpGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpGuideModal({
  open,
  onOpenChange,
}: HelpGuideModalProps) {
  const { startTour, reset, optOut, hasOptedOut } = useGuide();
  const router = useRouter();
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "";

  const handleStart = () => {
    // Close the modal first for a cleaner UX, then start the tour
    onOpenChange(false);
    // Slight delay to allow dialog close animation
    window.setTimeout(() => startTour(), 150);
  };

  const navigateWithGuide = (path: string) => {
    onOpenChange(false);
    // Ask guide to start automatically on next route
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sprintiq_tour_start_next", "true");
    }
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Help & Guides</DialogTitle>
          <DialogDescription>
            Explore quick guided tips around your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Navigate to Home Tour</h3>
                <p className="text-xs text-muted-foreground">
                  Highlights key areas like create projects, create spaces, and
                  more.
                </p>
              </div>
              <Button
                size="sm"
                variant="workspace"
                onClick={() => navigateWithGuide(`/${workspaceId}/home`)}
              >
                Start tour
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Navigate to Teams Tour</h3>
                <p className="text-xs text-muted-foreground">
                  Highlights key areas like create teams, invite members, and
                  more.
                </p>
              </div>
              <Button
                size="sm"
                variant="workspace"
                onClick={() => navigateWithGuide(`/${workspaceId}/teams`)}
              >
                Start tour
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Navigate to Agents Tour</h3>
                <p className="text-xs text-muted-foreground">
                  Highlights key areas generate stories, optimized sprint
                  assistant, and more.
                </p>
              </div>
              <Button
                size="sm"
                variant="workspace"
                onClick={() => navigateWithGuide(`/${workspaceId}/agents`)}
              >
                Start tour
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                reset();
              }}
            >
              Reset guide state
            </Button>
            <Button
              variant={hasOptedOut ? "default" : "outline"}
              size="sm"
              onClick={() => {
                optOut();
              }}
            >
              {hasOptedOut ? "Guides disabled" : "Don't show automatically"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
