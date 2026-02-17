"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Hand,
  Snail,
  FileText,
  UserRoundPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getAvatarInitials } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dynamically import the chart components to avoid SSR issues
const AgileToolsChart = dynamic(() => import("./agile-tools-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[300px]">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  ),
});

const CreationTrendsChart = dynamic(() => import("./creation-trends-chart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full workspace-header-bg rounded-xl border workspace-border p-4 shadow-sm">
      <div className="w-full h-[390px] animate-pulse bg-gray-200 rounded-md" />
    </div>
  ),
});

const WorldMap = dynamic(() => import("./world-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full workspace-header-bg rounded-xl border workspace-border p-4 shadow-sm">
      <div className="w-full h-[300px] animate-pulse bg-gray-200 rounded-md" />
    </div>
  ),
});

const getEventTypeIcon = (eventType: string) => {
  switch (eventType) {
    case "story_created":
      return {
        icon: <FileText className="h-4 w-4 text-blue-600" />,
        color: "bg-blue-500/10 text-blue-600",
      };
    case "space_created":
      return {
        icon: <FileText className="h-4 w-4 text-blue-600" />,
        color: "bg-blue-500/10 text-blue-600",
      };
    case "project_created":
      return {
        icon: <FileText className="h-4 w-4 text-blue-600" />,
        color: "bg-blue-500/10 text-blue-600",
      };
    case "sprint_created":
      return {
        icon: <FileText className="h-4 w-4 text-blue-600" />,
        color: "bg-blue-500/10 text-blue-600",
      };
    case "registered":
      return {
        icon: <UserRoundPlus className="h-4 w-4 text-emerald-600" />,
        color: "bg-emerald-500/10 text-emerald-600",
      };
  }
};

export interface Metric {
  label: string;
  icon: React.ElementType;
  value: number;
  percent: number;
  sub: string;
  color: string;
}

interface AdminDashboardClientProps {
  metrics: Metric[];
  recentEvents?: any[];
  timeSavingPercent?: number | null;
  avgAIDurationMs?: number | null;
  avgManualDurationMs?: number | null;
  agileToolsData?: any[];
  storyCounts?: any[];
  spaceCounts?: any[];
  projectCounts?: any[];
  sprintCounts?: any[];
  userLocations?: any[];
  user: any;
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  metrics,
  recentEvents = [],
  timeSavingPercent,
  avgAIDurationMs,
  avgManualDurationMs,
  agileToolsData = [],
  storyCounts = [],
  spaceCounts = [],
  projectCounts = [],
  sprintCounts = [],
  userLocations = [],
  user,
}) => {
  if (avgAIDurationMs == null || avgManualDurationMs == null) {
    return null;
  }
  let totalTimeDuration = avgAIDurationMs + avgManualDurationMs;

  return (
    <>
      {/* Congratulations Card */}
      <div className="mb-6">
        <Card className="relative overflow-hidden shadow-md workspace-header-bg border workspace-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Left Side - Text Content */}
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-2xl font-bold workspace-sidebar-text">
                    Congratulations {user?.full_name || user?.name || "Admin"}!
                    🎉
                  </h2>
                </div>
                <p className=" workspace-text-muted text-base leading-relaxed">
                  You have achieved{" "}
                  <span className="font-semibold text-emerald-600">85% 😎</span>{" "}
                  more user engagement today. Check your new performance badge
                  in your profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Saving Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {metrics.map((metric) => {
            const isPositive = metric.percent >= 0;
            const Icon = metric.icon;
            return (
              <Card
                key={metric.label}
                className="group relative overflow-hidden border workspace-border workspace-header-bg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                  <div className={`rounded-md p-2 ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.sub}
                    </p>
                    <div
                      className={
                        "flex items-center text-xs font-semibold " +
                        (isPositive ? "text-emerald-600" : "text-rose-600")
                      }
                    >
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {isPositive ? "+" : ""}
                      {metric.percent}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Creation Trends Chart */}
        {(storyCounts.length > 0 ||
          spaceCounts.length > 0 ||
          projectCounts.length > 0 ||
          sprintCounts.length > 0) && (
          <div className="col-span-2 h-full">
            <CreationTrendsChart
              storyCounts={storyCounts}
              spaceCounts={spaceCounts}
              projectCounts={projectCounts}
              sprintCounts={sprintCounts}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="group relative overflow-hidden border workspace-border workspace-header-bg shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saving</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  All time efficiency
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-emerald-600">
                    {timeSavingPercent != null && timeSavingPercent > 0
                      ? "+"
                      : ""}
                    {timeSavingPercent != null
                      ? timeSavingPercent.toFixed(1)
                      : "0"}
                    %
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-3">
                {timeSavingPercent != null
                  ? timeSavingPercent.toFixed(1) + "%"
                  : "0%"}
              </div>

              {/* Horizontal Bar Chart */}
              <div className="w-full h-3 rounded-full overflow-hidden mb-3">
                <div className="flex gap-2 h-full">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-700 ease-in-out"
                    style={{
                      width: `${(
                        (avgManualDurationMs / totalTimeDuration) *
                        100
                      ).toFixed(1)}%`,
                    }}
                  />
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-in-out"
                    style={{
                      width: `${(
                        (avgAIDurationMs / totalTimeDuration) *
                        100
                      ).toFixed(1)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-muted-foreground">Manual</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-muted-foreground">AI Generated</span>
                </div>
              </div>
            </div>

            {/* Breakdown by Method */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">AI Generated</div>
                    <div className="text-xs text-muted-foreground">
                      {avgAIDurationMs != null
                        ? (avgAIDurationMs / 1000).toFixed(1)
                        : "0"}{" "}
                      sec avg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">
                    {timeSavingPercent != null && timeSavingPercent > 0
                      ? "+"
                      : ""}
                    {timeSavingPercent != null
                      ? timeSavingPercent.toFixed(1)
                      : "0"}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">vs manual</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
                    <Hand className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Manual</div>
                    <div className="text-xs text-muted-foreground">
                      {avgManualDurationMs != null
                        ? (avgManualDurationMs / 1000).toFixed(1)
                        : "0"}{" "}
                      sec avg
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-rose-600">
                    Baseline
                  </div>
                  <div className="text-xs text-muted-foreground">100%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Recent Events Section */}
        {recentEvents.length > 0 && (
          <Card className="shadow-sm col-span-2 h-full workspace-header-bg border workspace-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 hover:workspace-hover transition-colors border-b workspace-border"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        getEventTypeIcon(event.type)?.color || "bg-gray-500/10"
                      }`}
                    >
                      {getEventTypeIcon(event.type)?.icon}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={event.profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback className="text-xs font-bold bg-emerald-500/10 text-emerald-600">
                        {getAvatarInitials(
                          event.profiles?.full_name,
                          event.profiles?.email
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">
                        {event.profiles?.full_name || "Unknown User"}
                      </span>
                      <span className="font-medium text-xs text-muted-foreground">
                        {event.profiles?.email || "Unknown User"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* World Map */}
        <div className="col-span-2">
          <WorldMap userLocations={userLocations} />
        </div>

        {/* Agile Tools Usage Chart */}
        {agileToolsData.length > 0 && <AgileToolsChart data={agileToolsData} />}
      </div>
    </>
  );
};

export default AdminDashboardClient;
