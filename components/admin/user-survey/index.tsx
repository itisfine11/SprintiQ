"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingOverlay } from "@/components/ui/loading-page";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { getAvatarInitials } from "@/lib/utils";

interface UserBaseline {
  id: string;
  user_id: string;
  baseline_story_time_ms: number;
  baseline_grooming_time_ms: number;
  baseline_planning_time_ms: number;
  baseline_stories_per_session: number;
  role: string;
  baseline_method: string;
  team_size: number;
  experience_level: string;
  agile_tools?: string | string[];
  agile_tools_other?: string;
  biggest_frustration?: string;
  heard_about_sprintiq?: string;
  heard_about_sprintiq_other?: string;
  measurement_date: string;
}

interface UserData {
  [key: string]: {
    id: string;
    email: string;
    avatar_url?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
}

interface UserSurveyClientProps {
  userBaselines: UserBaseline[];
  userData: UserData;
  error?: string;
}

export default function UserSurveyClient({
  userBaselines,
  userData,
  error,
}: UserSurveyClientProps) {
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterExperience, setFilterExperience] = useState("all");
  const [sortField, setSortField] = useState("measurement_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [chartMetric, setChartMetric] = useState<
    "story_time" | "grooming_time" | "planning_time" | "stories_per_session"
  >("story_time");

  // Reset page when sorting changes
  useEffect(() => {
    setPage(1);
  }, [sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const filteredData = useMemo(() => {
    let filtered = userBaselines;

    // Search filter
    if (search) {
      filtered = filtered.filter((baseline) => {
        const user = userData[baseline.user_id];
        const userEmail = user?.email || "";
        const userName =
          user?.user_metadata?.full_name || user?.user_metadata?.name || "";
        return (
          userEmail.toLowerCase().includes(search.toLowerCase()) ||
          userName.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Method filter
    if (filterMethod !== "all") {
      filtered = filtered.filter(
        (baseline) => baseline.baseline_method === filterMethod
      );
    }

    // Experience filter
    if (filterExperience !== "all") {
      filtered = filtered.filter(
        (baseline) => baseline.experience_level === filterExperience
      );
    }

    // Sort data
    if (sortField && sortDirection) {
      const sortedData = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case "measurement_date":
            aValue = new Date(a.measurement_date).getTime();
            bValue = new Date(b.measurement_date).getTime();
            break;
          case "baseline_story_time_ms":
            aValue = a.baseline_story_time_ms || 0;
            bValue = b.baseline_story_time_ms || 0;
            break;
          case "baseline_grooming_time_ms":
            aValue = a.baseline_grooming_time_ms || 0;
            bValue = b.baseline_grooming_time_ms || 0;
            break;
          case "baseline_planning_time_ms":
            aValue = a.baseline_planning_time_ms || 0;
            bValue = b.baseline_planning_time_ms || 0;
            break;
          case "baseline_stories_per_session":
            aValue = a.baseline_stories_per_session || 0;
            bValue = b.baseline_stories_per_session || 0;
            break;
          case "team_size":
            aValue = a.team_size || 0;
            bValue = b.team_size || 0;
            break;
          case "role":
            aValue = a.role || "";
            bValue = b.role || "";
            break;
          case "baseline_method":
            aValue = a.baseline_method || "";
            bValue = b.baseline_method || "";
            break;
          case "experience_level":
            aValue = a.experience_level || "";
            bValue = b.experience_level || "";
            break;
          case "user_name":
            const userA = userData[a.user_id];
            const userB = userData[b.user_id];
            aValue = (
              userA?.user_metadata?.full_name ||
              userA?.email ||
              ""
            ).toLowerCase();
            bValue = (
              userB?.user_metadata?.full_name ||
              userB?.email ||
              ""
            ).toLowerCase();
            break;
          default:
            aValue = a[sortField as keyof typeof a] || "";
            bValue = b[sortField as keyof typeof b] || "";
        }

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
      return sortedData;
    }

    return filtered;
  }, [
    userBaselines,
    search,
    filterMethod,
    filterExperience,
    sortField,
    sortDirection,
    userData,
  ]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const formatTime = (ms: number) => {
    const minutes = Math.round(ms / (1000 * 60));
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "User Email",
      "User Name",
      "Story Creation Time",
      "Grooming Time",
      "Planning Time",
      "Stories Per Session",
      "Method",
      "Team Size",
      "Experience Level",
      "Agile Tools",
      "Agile Tools Other",
      "Biggest Frustration",
      "Heard About SprintiQ",
      "Heard About SprintiQ Other",
      "Measurement Date",
    ];

    const csvData = filteredData.map((baseline) => {
      const user = userData[baseline.user_id];
      return [
        user?.email || "",
        user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        formatTime(baseline.baseline_story_time_ms),
        formatTime(baseline.baseline_grooming_time_ms),
        formatTime(baseline.baseline_planning_time_ms),
        baseline.baseline_stories_per_session,
        baseline.baseline_method,
        baseline.team_size,
        baseline.role,
        baseline.experience_level,
        baseline.agile_tools || "",
        baseline.agile_tools_other || "",
        baseline.biggest_frustration || "",
        baseline.heard_about_sprintiq || "",
        baseline.heard_about_sprintiq_other || "",
        formatDate(baseline.measurement_date),
      ];
    });

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-survey-data-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToolsBreakdown = () => {
    const headers = [
      "Tool Name",
      "User Count",
      "Percentage",
      "Total Responses",
    ];

    const csvData = agileToolsData.map((tool) => [
      tool.tool,
      tool.count,
      `${tool.percentage}%`,
      filteredData.length,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agile-tools-breakdown-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportAverageTimeMetrics = () => {
    const headers = [
      "Metric",
      "Average Time (minutes)",
      "Total Users",
      "Export Date",
    ];

    const csvData = averageTimeData.map((metric) => [
      metric.metric,
      metric.time,
      filteredData.length,
      new Date().toISOString().split("T")[0],
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `average-time-metrics-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Chart data processing
  const chartData = useMemo(() => {
    const sortedData = [...filteredData].sort(
      (a, b) =>
        new Date(a.measurement_date).getTime() -
        new Date(b.measurement_date).getTime()
    );

    return sortedData.map((baseline) => {
      const user = userData[baseline.user_id];
      let metricValue: number;

      switch (chartMetric) {
        case "story_time":
          metricValue = baseline.baseline_story_time_ms / (1000 * 60); // Convert to minutes
          break;
        case "grooming_time":
          metricValue = baseline.baseline_grooming_time_ms / (1000 * 60);
          break;
        case "planning_time":
          metricValue = baseline.baseline_planning_time_ms / (1000 * 60);
          break;
        case "stories_per_session":
          metricValue = baseline.baseline_stories_per_session;
          break;
        default:
          metricValue = baseline.baseline_story_time_ms / (1000 * 60);
      }

      return {
        date: new Date(baseline.measurement_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: Math.round(metricValue * 10) / 10, // Round to 1 decimal place
        user:
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          user?.email ||
          "Unknown",
        method: baseline.baseline_method,
        experience: baseline.experience_level,
        teamSize: baseline.team_size,
      };
    });
  }, [filteredData, chartMetric, userData]);

  const getMetricLabel = () => {
    switch (chartMetric) {
      case "story_time":
        return "Story Creation Time (minutes)";
      case "grooming_time":
        return "Grooming Time (minutes)";
      case "planning_time":
        return "Planning Time (minutes)";
      case "stories_per_session":
        return "Stories per Session";
      default:
        return "Story Creation Time (minutes)";
    }
  };

  // Bar chart data processing for Agile tools
  const agileToolsData = useMemo(() => {
    const toolsCount: { [key: string]: number } = {};

    filteredData.forEach((baseline) => {
      if (!baseline.agile_tools) {
        toolsCount["Not Specified"] = (toolsCount["Not Specified"] || 0) + 1;
        return;
      }

      try {
        // Check if agile_tools is a JSON string (array)
        let tools: string[] = [];

        if (typeof baseline.agile_tools === "string") {
          // Try to parse as JSON first (for array format)
          try {
            const parsed = JSON.parse(baseline.agile_tools);
            if (Array.isArray(parsed)) {
              tools = parsed;
            } else {
              // Single tool as string
              tools = [baseline.agile_tools];
            }
          } catch {
            // If parsing fails, treat as single tool string
            tools = [baseline.agile_tools];
          }
        } else if (Array.isArray(baseline.agile_tools)) {
          tools = baseline.agile_tools;
        } else {
          tools = [String(baseline.agile_tools)];
        }

        // Count each individual tool
        tools.forEach((tool) => {
          if (tool && tool.trim()) {
            const cleanTool = tool.trim();
            toolsCount[cleanTool] = (toolsCount[cleanTool] || 0) + 1;
          }
        });
      } catch (error) {
        console.error(
          "Error processing agile tools:",
          error,
          baseline.agile_tools
        );
        toolsCount["Error Processing"] =
          (toolsCount["Error Processing"] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    return Object.entries(toolsCount)
      .map(([tool, count]) => ({
        tool,
        count,
        percentage: Math.round((count / filteredData.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Bar chart data processing for Frustrations
  const frustrationData = useMemo(() => {
    const frustrationCount: { [key: string]: number } = {};

    filteredData.forEach((baseline) => {
      const frustration = baseline.biggest_frustration || "Not Specified";
      frustrationCount[frustration] = (frustrationCount[frustration] || 0) + 1;
    });

    // Convert to array and sort by count
    return Object.entries(frustrationCount)
      .map(([frustration, count]) => ({
        frustration,
        count,
        percentage: Math.round((count / filteredData.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Bar chart data processing for Discovery channels
  const discoveryData = useMemo(() => {
    const discoveryCount: { [key: string]: number } = {};

    filteredData.forEach((baseline) => {
      const discovery = baseline.heard_about_sprintiq || "Not Specified";
      discoveryCount[discovery] = (discoveryCount[discovery] || 0) + 1;
    });

    // Convert to array and sort by count
    return Object.entries(discoveryCount)
      .map(([discovery, count]) => ({
        discovery,
        count,
        percentage: Math.round((count / filteredData.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Bar chart data processing for Average Time Metrics
  const averageTimeData = useMemo(() => {
    if (filteredData.length === 0) return [];

    const totalStoryTime = filteredData.reduce(
      (sum, baseline) => sum + (baseline.baseline_story_time_ms || 0),
      0
    );
    const totalGroomingTime = filteredData.reduce(
      (sum, baseline) => sum + (baseline.baseline_grooming_time_ms || 0),
      0
    );
    const totalPlanningTime = filteredData.reduce(
      (sum, baseline) => sum + (baseline.baseline_planning_time_ms || 0),
      0
    );

    const avgStoryTime = Math.round(
      totalStoryTime / filteredData.length / (1000 * 60)
    ); // Convert to minutes
    const avgGroomingTime = Math.round(
      totalGroomingTime / filteredData.length / (1000 * 60)
    );
    const avgPlanningTime = Math.round(
      totalPlanningTime / filteredData.length / (1000 * 60)
    );

    return [
      {
        metric: "Story Creation",
        time: avgStoryTime,
        color: "#10b981", // Green
        unit: "min",
      },
      {
        metric: "Backlog Grooming",
        time: avgGroomingTime,
        color: "#3b82f6", // Blue
        unit: "min",
      },
      {
        metric: "Planning",
        time: avgPlanningTime,
        color: "#f59e0b", // Amber
        unit: "min",
      },
    ];
  }, [filteredData]);

  if (error) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Survey Data</h1>
          <p className="text-muted-foreground text-sm">
            Survey responses from users
          </p>
        </div>
        <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border">
          <div className="text-center text-red-500 py-12">
            Error loading data: {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Survey Data</h1>
        <p className="text-muted-foreground text-sm">
          Survey responses from users
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="templates">Templates</SelectItem>
            <SelectItem value="other_tools">Other Tools</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterExperience} onValueChange={setFilterExperience}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Select>
            <SelectTrigger className="ml-2 w-48">
              <SelectValue placeholder="Select Charts" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-all"
                    checked={selectedCharts.length === 5}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([
                          "trends",
                          "tools",
                          "frustrations",
                          "discovery",
                          "avg-time",
                        ]);
                      } else {
                        setSelectedCharts([]);
                      }
                    }}
                  />
                  <label htmlFor="show-all" className="text-sm font-medium">
                    Show All
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trends"
                    checked={selectedCharts.includes("trends")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([...selectedCharts, "trends"]);
                      } else {
                        setSelectedCharts(
                          selectedCharts.filter((chart) => chart !== "trends")
                        );
                      }
                    }}
                  />
                  <label htmlFor="trends" className="text-sm">
                    Performance Trends
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tools"
                    checked={selectedCharts.includes("tools")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([...selectedCharts, "tools"]);
                      } else {
                        setSelectedCharts(
                          selectedCharts.filter((chart) => chart !== "tools")
                        );
                      }
                    }}
                  />
                  <label htmlFor="tools" className="text-sm">
                    Agile Tools Usage
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="frustrations"
                    checked={selectedCharts.includes("frustrations")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([...selectedCharts, "frustrations"]);
                      } else {
                        setSelectedCharts(
                          selectedCharts.filter(
                            (chart) => chart !== "frustrations"
                          )
                        );
                      }
                    }}
                  />
                  <label htmlFor="frustrations" className="text-sm">
                    Biggest Frustrations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discovery"
                    checked={selectedCharts.includes("discovery")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([...selectedCharts, "discovery"]);
                      } else {
                        setSelectedCharts(
                          selectedCharts.filter(
                            (chart) => chart !== "discovery"
                          )
                        );
                      }
                    }}
                  />
                  <label htmlFor="discovery" className="text-sm">
                    Discovery Channels
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avg-time"
                    checked={selectedCharts.includes("avg-time")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCharts([...selectedCharts, "avg-time"]);
                      } else {
                        setSelectedCharts(
                          selectedCharts.filter((chart) => chart !== "avg-time")
                        );
                      }
                    }}
                  />
                  <label htmlFor="avg-time" className="text-sm">
                    Average Time Metrics
                  </label>
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        {selectedCharts.includes("tools") && (
          <Button onClick={exportToolsBreakdown} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Tools Breakdown
          </Button>
        )}
        {selectedCharts.includes("avg-time") && (
          <Button onClick={exportAverageTimeMetrics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Average Time Metrics
          </Button>
        )}
      </div>
      {/* Chart Section */}
      {selectedCharts.includes("trends") && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Survey Data Trends</h3>
            <Select
              value={chartMetric}
              onValueChange={(value: any) => setChartMetric(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story_time">Story Creation Time</SelectItem>
                <SelectItem value="grooming_time">Grooming Time</SelectItem>
                <SelectItem value="planning_time">Planning Time</SelectItem>
                <SelectItem value="stories_per_session">
                  Stories per Session
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: getMetricLabel(),
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-sm text-gray-600">
                            {getMetricLabel()}: {data.value}
                          </p>
                          <p className="text-xs text-gray-500">
                            User: {data.user}
                          </p>
                          <p className="text-xs text-gray-500">
                            Method: {data.method}
                          </p>
                          <p className="text-xs text-gray-500">
                            Experience: {data.experience}
                          </p>
                          <p className="text-xs text-gray-500">
                            Team Size: {data.teamSize}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          selectedCharts.filter(
            (chart) => chart !== "trends" && chart !== "avg-time"
          ).length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {/* Bar Chart Section */}
        {selectedCharts.includes("tools") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agile Tools Usage</h3>
              <div className="text-sm text-muted-foreground">
                Total responses: {filteredData.length}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={agileToolsData}
                  margin={{ top: 16, right: 24, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="tool"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Number of Users",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-sm text-gray-600">
                              Users: {data.count}
                            </p>
                            <p className="text-xs text-gray-500">
                              Percentage: {data.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Frustration Chart Section */}
        {selectedCharts.includes("frustrations") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Biggest Frustrations</h3>
              <div className="text-sm text-muted-foreground">
                Total responses: {filteredData.length}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={frustrationData}
                  margin={{ top: 16, right: 24, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="frustration"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Number of Users",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-sm text-gray-600">
                              Users: {data.count}
                            </p>
                            <p className="text-xs text-gray-500">
                              Percentage: {data.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Discovery Chart Section */}
        {selectedCharts.includes("discovery") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Discovery Channels</h3>
              <div className="text-sm text-muted-foreground">
                Total responses: {filteredData.length}
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={discoveryData}
                  margin={{ top: 16, right: 24, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="discovery"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Number of Users",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-sm text-gray-600">
                              Users: {data.count}
                            </p>
                            <p className="text-xs text-gray-500">
                              Percentage: {data.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Average Time Metrics Chart */}
        {selectedCharts.includes("avg-time") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Average Time Metrics</h3>
              <div className="text-sm text-muted-foreground">
                Average across {filteredData.length} users
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={averageTimeData}
                  margin={{ top: 16, right: 24, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="metric"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Time (minutes)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-sm text-gray-600">
                              Average Time: {data.time} {data.unit}
                            </p>
                            <p className="text-xs text-gray-500">
                              Total Users: {filteredData.length}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="time" fill="#00A6F4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="relative rounded-xl p-0 md:p-6 shadow-lg border workspace-border overflow-x-auto">
        {loading && <LoadingOverlay />}
        <table className="min-w-full text-sm">
          <thead>
            <tr className="workspace-sidebar-text">
              <th className="px-4 py-3 text-left sticky left-0 z-10 workspace-header-bg">
                <button
                  onClick={() => handleSort("user_name")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  User {getSortIcon("user_name")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("baseline_story_time_ms")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Story Time {getSortIcon("baseline_story_time_ms")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("baseline_grooming_time_ms")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Grooming Time {getSortIcon("baseline_grooming_time_ms")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("baseline_planning_time_ms")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Planning Time {getSortIcon("baseline_planning_time_ms")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("baseline_stories_per_session")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Stories/ Session {getSortIcon("baseline_stories_per_session")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Role {getSortIcon("role")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("baseline_method")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Method {getSortIcon("baseline_method")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("team_size")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Team Size {getSortIcon("team_size")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("experience_level")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Experience {getSortIcon("experience_level")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("agile_tools")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Agile Tools {getSortIcon("agile_tools")}
                </button>
              </th>
              <th className="px-10 py-3 text-left">
                <button
                  onClick={() => handleSort("biggest_frustration")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Frustration {getSortIcon("biggest_frustration")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("heard_about_sprintiq")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Discovery {getSortIcon("heard_about_sprintiq")}
                </button>
              </th>
              <th className="px-12 py-3 text-left">
                <button
                  onClick={() => handleSort("measurement_date")}
                  className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                >
                  Date {getSortIcon("measurement_date")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((baseline) => (
              <tr
                key={baseline.id}
                className="border-t workspace-border hover:workspace-hover cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 min-w-[200px] sticky left-0 z-10 workspace-header-bg duration-300 group-hover:workspace-hover">
                  <div className="flex items-center gap-3">
                    <Avatar className="group-hover:scale-105 duration-300 w-8 h-8">
                      <AvatarImage
                        src={userData[baseline.user_id]?.avatar_url}
                        alt={
                          userData[baseline.user_id]?.user_metadata
                            ?.full_name || "User"
                        }
                      />
                      <AvatarFallback className="text-sm bg-emerald-500/10 text-emerald-500 font-bold">
                        {getAvatarInitials(
                          userData[baseline.user_id]?.user_metadata
                            ?.full_name || "",
                          userData[baseline.user_id]?.email || ""
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold workspace-sidebar-text group-hover:scale-105 duration-300 text-sm">
                        {userData[baseline.user_id]?.user_metadata?.full_name ||
                          userData[baseline.user_id]?.user_metadata?.name ||
                          "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:scale-105 duration-300 ">
                        {userData[baseline.user_id]?.email || "No email"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {formatTime(baseline.baseline_story_time_ms)}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {formatTime(baseline.baseline_grooming_time_ms)}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {formatTime(baseline.baseline_planning_time_ms)}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {baseline.baseline_stories_per_session}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {baseline.role}
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300 text-xs">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-emerald-500/10 text-emerald-500"
                  >
                    {baseline.baseline_method}
                  </Badge>
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-sm group-hover:scale-105 duration-300">
                  {baseline.team_size}
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300 text-xs">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-rose-500/10 text-rose-500"
                  >
                    {baseline.experience_level}
                  </Badge>
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300 text-xs">
                  {(() => {
                    if (!baseline.agile_tools)
                      return <span className="text-muted-foreground">N/A</span>;

                    let tools: string[] = [];
                    if (typeof baseline.agile_tools === "string") {
                      try {
                        const parsed = JSON.parse(baseline.agile_tools);
                        tools = Array.isArray(parsed)
                          ? parsed
                          : [baseline.agile_tools];
                      } catch {
                        tools = [baseline.agile_tools];
                      }
                    } else if (Array.isArray(baseline.agile_tools)) {
                      tools = baseline.agile_tools;
                    } else {
                      tools = [String(baseline.agile_tools)];
                    }

                    return (
                      <div className="flex flex-wrap gap-1">
                        {tools.map((tool, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-500/10 text-blue-500"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    );
                  })()}
                  {baseline.agile_tools_other && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Other: {baseline.agile_tools_other}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300 text-xs">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-500/10 text-yellow-500"
                  >
                    {baseline.biggest_frustration || "N/A"}
                  </Badge>
                </td>
                <td className="px-4 py-3 group-hover:scale-105 duration-300 text-xs">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-500/10 text-purple-500"
                  >
                    {baseline.heard_about_sprintiq || "N/A"}
                  </Badge>
                  {baseline.heard_about_sprintiq === "Other" &&
                    baseline.heard_about_sprintiq_other && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {baseline.heard_about_sprintiq_other}
                      </div>
                    )}
                </td>
                <td className="px-4 py-3 workspace-sidebar-text text-xs group-hover:scale-105 duration-300">
                  {formatDate(baseline.measurement_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && paginatedData.length === 0 && (
          <div className="text-center workspace-sidebar-text py-12">
            No survey responses found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filteredData.length)} of{" "}
          {filteredData.length} results
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === page;
              const show =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - page) <= 1;
              if (
                !show &&
                ((pageNum === 2 && page > 3) ||
                  (pageNum === totalPages - 1 && page < totalPages - 2))
              ) {
                return (
                  <PaginationItem key={pageNum + "ellipsis"}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              if (!show) return null;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={isCurrent}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
