"use client";

import { createClientSupabaseClient } from "@/lib/supabase/client";
import {
  Users,
  Layout,
  FolderOpen,
  Calendar,
  BarChart3,
  ListChecks,
  Zap,
  Hand,
} from "lucide-react";
import AdminLayout from "@/components/admin/layout";
import AdminDashboardClient, { Metric } from "@/components/admin/dashboard";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

function getMonthRange(date: Date) {
  // Returns [startOfMonth, startOfNextMonth]
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return [start, next];
}

function getLastMonthRange(date: Date) {
  // Returns [startOfLastMonth, startOfThisMonth]
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);
  return [start, end];
}

function calcPercentChange(current: number, last: number) {
  if (last === 0 && current === 0) return 0;
  if (last === 0) return 100;
  return Math.round(((current - last) / Math.max(last, 1)) * 100);
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [timeSavingPercent, setTimeSavingPercent] = useState<number | null>(
    null
  );
  const [avgAIDurationMs, setAvgAIDurationMs] = useState<number | null>(null);
  const [avgManualDurationMs, setAvgManualDurationMs] = useState<number | null>(
    null
  );
  const [agileToolsData, setAgileToolsData] = useState<any[]>([]);
  const [storyCounts, setStoryCounts] = useState<any[]>([]);
  const [spaceCounts, setSpaceCounts] = useState<any[]>([]);
  const [projectCounts, setProjectCounts] = useState<any[]>([]);
  const [sprintCounts, setSprintCounts] = useState<any[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientSupabaseClient();
      const now = new Date();
      const [thisMonthStart, nextMonthStart] = getMonthRange(now);
      const [lastMonthStart, thisMonthStart2] = getLastMonthRange(now);

      // Get current authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      let userData = null;
      if (authUser) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (!profileError && profileData) {
          userData = profileData;
        }
      }

      // Set user data
      setUser(userData);

      // Helper to get counts for a table
      async function getCounts(table: string) {
        // Total
        const { count: total = 0 } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        // This month
        const { count: thisMonth = 0 } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true })
          .gte("created_at", thisMonthStart.toISOString())
          .lt("created_at", nextMonthStart.toISOString());
        // Last month
        const { count: lastMonth = 0 } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true })
          .gte("created_at", lastMonthStart.toISOString())
          .lt("created_at", thisMonthStart2.toISOString());
        return { total, thisMonth, lastMonth };
      }

      try {
        // Fetch all counts
        const [users, workspaces, spaces, projects, sprints, tasks] =
          await Promise.all([
            getCounts("users"),
            getCounts("workspaces"),
            getCounts("spaces"),
            getCounts("projects"),
            getCounts("sprints"),
            getCounts("tasks"),
          ]);

        // Calculate percent changes
        const metricsData = [
          {
            label: "Total Users",
            icon: Users,
            color: "bg-emerald-500/10 text-emerald-500",
            value: users.total ?? 0,
            percent: calcPercentChange(
              users.thisMonth ?? 0,
              users.lastMonth ?? 0
            ),
            sub: "Registered users",
          },
          {
            label: "Total Workspaces",
            icon: Layout,
            color: "bg-rose-500/10 text-rose-500",
            value: workspaces.total ?? 0,
            percent: calcPercentChange(
              workspaces.thisMonth ?? 0,
              workspaces.lastMonth ?? 0
            ),
            sub: "All workspaces",
          },
          {
            label: "Total Spaces",
            icon: FolderOpen,
            color: "bg-yellow-500/10 text-yellow-500",
            value: spaces.total ?? 0,
            percent: calcPercentChange(
              spaces.thisMonth ?? 0,
              spaces.lastMonth ?? 0
            ),
            sub: "All spaces",
          },
          {
            label: "Total Projects",
            icon: BarChart3,
            color: "bg-blue-500/10 text-blue-500",
            value: projects.total ?? 0,
            percent: calcPercentChange(
              projects.thisMonth ?? 0,
              projects.lastMonth ?? 0
            ),
            sub: "All projects",
          },
          {
            label: "Total Sprints",
            icon: Calendar,
            color: "bg-sky-500/10 text-sky-500",
            value: sprints.total ?? 0,
            percent: calcPercentChange(
              sprints.thisMonth ?? 0,
              sprints.lastMonth ?? 0
            ),
            sub: "All sprints",
          },
          {
            label: "Total Tasks",
            icon: ListChecks,
            color: "bg-purple-500/10 text-purple-500",
            value: tasks.total ?? 0,
            percent: calcPercentChange(
              tasks.thisMonth ?? 0,
              tasks.lastMonth ?? 0
            ),
            sub: "All tasks",
          },
        ];

        setMetrics(metricsData);

        // Fetch recent events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select(
            `
            *,
            profiles:user_id (
              id,
              full_name,
              email,
              avatar_url
            )
          `
          )
          .eq("type", "registered")
          .eq("entity_type", "auth")
          .order("created_at", { ascending: false })
          .limit(5);

        if (!eventsError) {
          setRecentEvents(eventsData || []);
        }

        // Fetch time saving data
        const { data: aiSessions, error: aiErr } = await supabase
          .from("time_tracking_sessions")
          .select("timestamp, story_count")
          .eq("event_type", "story_creation")
          .eq("method", "ai_generated");

        const { data: baselines, error: baseErr } = await supabase
          .from("user_baselines")
          .select(
            "baseline_story_time_ms, baseline_grooming_time_ms, baseline_stories_per_session"
          )
          .eq("baseline_method", "manual");

        if (!aiErr && !baseErr) {
          // Manual avg duration (ms)
          const a_num = (baselines || []).reduce(
            (sum: number, b: any) =>
              sum +
              (b.baseline_story_time_ms || 0) +
              (b.baseline_grooming_time_ms || 0),
            0
          );
          const a_den = (baselines || []).reduce(
            (sum: number, b: any) =>
              sum + (b.baseline_stories_per_session || 0),
            0
          );
          const a = a_den > 0 ? a_num / a_den : null;
          setAvgManualDurationMs(a);

          // AI avg duration (ms)
          const b_num = (aiSessions || []).reduce(
            (sum: number, s: any) => sum + (s.timestamp || 0),
            0
          );
          const b_den = (aiSessions || []).reduce(
            (sum: number, s: any) => sum + (s.story_count || 0),
            0
          );
          const b = b_den > 0 ? b_num / b_den : null;
          setAvgAIDurationMs(b);

          if (a && b && a > 0) {
            setTimeSavingPercent(((a - b) / a) * 100);
          }
        }

        // Fetch agile tools usage data
        const { data: userBaselines, error: baselinesError } = await supabase
          .from("user_baselines")
          .select("agile_tools")
          .not("agile_tools", "is", null);

        if (!baselinesError && userBaselines) {
          const toolsCount: { [key: string]: number } = {};

          userBaselines.forEach((baseline: any) => {
            const tool = baseline.agile_tools || "Not Specified";
            toolsCount[tool] = (toolsCount[tool] || 0) + 1;
          });

          // Convert to array and sort by count
          const agileToolsDataArray = Object.entries(toolsCount)
            .map(([tool, count]) => ({
              tool,
              count,
              percentage: Math.round((count / userBaselines.length) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 tools

          setAgileToolsData(agileToolsDataArray);
        }

        // Fetch user location data
        const { data: locationData, error: locationError } = await supabase
          .from("profiles")
          .select(
            `
            id,
            timezones!inner(
              id,
              country,
              city
            )
          `
          )
          .not("timezone", "is", null);

        if (!locationError && locationData) {
          // Process location data to count users per country/city
          const locationCounts = locationData.reduce(
            (acc: any, profile: any) => {
              const country = profile.timezones?.country || "Unknown";
              const city = profile.timezones?.city || "Unknown";
              const key = `${country}-${city}`;

              if (!acc[key]) {
                acc[key] = {
                  country,
                  city,
                  userCount: 0,
                };
              }
              acc[key].userCount += 1;
              return acc;
            },
            {}
          );

          setUserLocations(Object.values(locationCounts));
        }

        // Fetch creation trends data
        const [storyData, spaceData, projectData, sprintData] =
          await Promise.all([
            supabase.rpc("per_minute_counts", { table_name: "tasks" }),
            supabase.rpc("per_minute_counts", { table_name: "spaces" }),
            supabase.rpc("per_minute_counts", { table_name: "projects" }),
            supabase.rpc("per_minute_counts", { table_name: "sprints" }),
          ]);

        setStoryCounts(storyData.data || []);
        setSpaceCounts(spaceData.data || []);
        setProjectCounts(projectData.data || []);
        setSprintCounts(sprintData.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="mb-6">
          <Card className="relative overflow-hidden shadow-md workspace-header-bg border workspace-border">
            <CardContent className="p-6">
              <div className="w-1/3 h-8 animate-pulse bg-gray-200 rounded-md mb-3" />
              <div className="w-1/2 h-6 animate-pulse bg-gray-200 rounded-md" />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => {
              const isPositive = Math.random() >= 0.5;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border workspace-border h-[146px] workspace-header-bg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="w-1/2 h-6 animate-pulse bg-gray-200 rounded-md" />
                    <div className={`rounded-md p-2 bg-gray-500/10`}>
                      <div className="w-5 h-5 animate-pulse bg-gray-500 rounded-md" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="w-1/3 h-6 animate-pulse bg-gray-200 rounded-md mb-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-1/2 h-3 animate-pulse bg-gray-200 rounded-md" />
                      <div className="flex items-center text-xs font-semibold ">
                        <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card className="col-span-2 h-full workspace-header-bg border workspace-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Creation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[390px] animate-pulse bg-gray-200 rounded-md" />
            </CardContent>
          </Card>
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
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                </div>
                <div className="w-24 h-7 animate-pulse bg-gray-200 rounded-md mb-3" />

                {/* Horizontal Bar Chart */}
                <div className="w-full h-[14px] rounded-full overflow-hidden mb-3">
                  <div className="flex gap-2 h-full">
                    <div
                      className="bg-gray-200 animate-pulse rounded-full"
                      style={{
                        width: `${(0.8 * 100).toFixed(1)}%`,
                      }}
                    />
                    <div
                      className="bg-gray-200 animate-pulse rounded-full"
                      style={{
                        width: `${(0.2 * 100).toFixed(1)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 animate-pulse bg-gray-200 rounded-full" />
                    <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 animate-pulse bg-gray-200 rounded-full" />
                    <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Breakdown by Method */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="w-20 h-3 animate-pulse bg-gray-200 rounded-md mb-1" />
                      <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                    </div>
                  </div>
                  <div className="items-end flex flex-col justify-end">
                    <div className="w-16 h-3 animate-pulse bg-gray-200 rounded-md mb-1" />
                    <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center">
                      <Hand className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="w-20 h-3 animate-pulse bg-gray-200 rounded-md mb-1" />
                      <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                    </div>
                  </div>
                  <div className="items-end flex flex-col justify-end">
                    <div className="w-16 h-3 animate-pulse bg-gray-200 rounded-md mb-1" />
                    <div className="w-12 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Recent Events Section */}
          <Card className="shadow-sm col-span-2 h-full workspace-header-bg border workspace-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:workspace-hover transition-colors border-b workspace-border"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${"bg-gray-500/10"}`}
                    >
                      <div className="w-5 h-5 animate-pulse bg-gray-500 rounded-md" />
                    </div>
                    <div className="w-8 h-8 animate-pulse bg-gray-500 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <div className="w-24 h-3 animate-pulse bg-gray-200 rounded-md" />
                      <div className="w-32 h-3 animate-pulse bg-gray-200 rounded-md" />
                    </div>
                    <div className="flex-1">
                      <div className="w-64 h-3 animate-pulse bg-gray-200 rounded-md" />
                    </div>
                    <div className="w-24 h-3 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* World Map Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-2 workspace-header-bg border workspace-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                User Distribution
              </CardTitle>
              <div className="w-5 h-5 animate-pulse bg-gray-500 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px] animate-pulse bg-gray-200 rounded-md" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminDashboardClient
        metrics={metrics}
        recentEvents={recentEvents}
        timeSavingPercent={timeSavingPercent}
        avgAIDurationMs={avgAIDurationMs}
        avgManualDurationMs={avgManualDurationMs}
        agileToolsData={agileToolsData}
        storyCounts={storyCounts}
        spaceCounts={spaceCounts}
        projectCounts={projectCounts}
        sprintCounts={sprintCounts}
        userLocations={userLocations}
        user={user}
      />
    </AdminLayout>
  );
}
