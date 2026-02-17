"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useEnhancedToast } from "@/hooks/use-enhanced-toast";
import type { SprintFolder } from "@/lib/database.types";

interface RenameSprintFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedSprintFolder: SprintFolder) => void;
  sprintFolder: SprintFolder;
}

export default function RenameSprintFolderModal({
  open,
  onOpenChange,
  onSuccess,
  sprintFolder,
}: RenameSprintFolderModalProps) {
  const { toast } = useEnhancedToast();
  const supabase = createClientSupabaseClient();

  const [name, setName] = useState(sprintFolder.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === sprintFolder.name) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data: updatedSprintFolder, error } = await supabase
        .from("sprint_folders")
        .update({ name: name.trim() })
        .eq("id", sprintFolder.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Sprint folder renamed",
        description: `Sprint folder has been renamed to "${name.trim()}".`,
        browserNotificationTitle: "Sprint folder renamed",
        browserNotificationBody: `Sprint folder has been renamed to "${name.trim()}".`,
      });

      onSuccess(updatedSprintFolder);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error renaming sprint folder:", error);
      toast({
        title: "Error renaming sprint folder",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Sprint Folder</DialogTitle>
          <DialogDescription>
            Enter a new name for the sprint folder "{sprintFolder.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="sprint-folder-name">Sprint folder name</Label>
            <Input
              id="sprint-folder-name"
              variant="workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sprint folder name"
              className="mt-1"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 