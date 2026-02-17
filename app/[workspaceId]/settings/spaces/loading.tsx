import { Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spaces - SprintiQ",
  description: "SprintiQ Spaces page",
};

export default function SpacesLoading() {
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Spaces</h2>
          <p className="text-sm text-muted-foreground">
            Manage spaces in your workspace. Spaces help organize projects and
            control access.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="workspace-header-bg border workspace-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="w-32 h-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="workspace-header-bg border workspace-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              Spaces
            </CardTitle>
            <CardDescription className="text-xs">
              Overview of all spaces in your workspace with their projects and
              settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Space</TableHead>
                  <TableHead className="text-sm">Visibility</TableHead>
                  <TableHead className="text-sm">Projects</TableHead>
                  <TableHead className="text-sm">Tasks</TableHead>
                  <TableHead className="text-sm">Members</TableHead>
                  <TableHead className="text-sm">Statuses</TableHead>
                  <TableHead className="text-sm">Tags</TableHead>
                  <TableHead className="text-sm">Created</TableHead>
                  <TableHead className="text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex flex-col gap-2">
                          <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
                          <div className="w-24 h-2 bg-gray-200 rounded-md animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 bg-gray-200 rounded-lg animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 bg-gray-200 rounded-lg animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 bg-gray-200 rounded-lg animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-4 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-10 h-4 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-4 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-8 h-4 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-8 h-4 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-8 h-4 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 bg-gray-200 rounded-lg animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
