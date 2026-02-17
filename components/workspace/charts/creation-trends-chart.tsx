"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Circle, CirclePlay, Hash, Layout, SquareCheckBig } from "lucide-react";

interface TrendData {
  date: string;
  count: number;
}

interface CreationTrendsChartProps {
  storyData: TrendData[];
  projectData: TrendData[];
  sprintData: TrendData[];
  spaceData: TrendData[];
  timeRange: "daily" | "weekly" | "monthly";
}

const CreationTrendsChart: React.FC<CreationTrendsChartProps> = ({
  storyData,
  projectData,
  sprintData,
  spaceData,
  timeRange,
}) => {
  const [selectedRange, setSelectedRange] = useState(timeRange);

  // Process data based on selected range
  const processedData = useMemo(() => {
    const processData = (data: TrendData[], range: string) => {
      const grouped = new Map<string, number>();

      data.forEach((item) => {
        let key = item.date;

        if (range === "weekly") {
          // Group by week (YYYY-Www format)
          const date = new Date(item.date);
          const year = date.getFullYear();
          const week = getWeekNumber(date);
          key = `${year}-W${week.toString().padStart(2, "0")}`;
        } else if (range === "monthly") {
          // Group by month (YYYY-MM format)
          key = item.date.substring(0, 7);
        }
        // For daily, keep the original date format

        grouped.set(key, (grouped.get(key) || 0) + item.count);
      });

      return Array.from(grouped.entries())
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    };

    return {
      stories: processData(storyData, selectedRange),
      projects: processData(projectData, selectedRange),
      sprints: processData(sprintData, selectedRange),
      spaces: processData(spaceData, selectedRange),
    };
  }, [storyData, projectData, sprintData, spaceData, selectedRange]);

  // Combine all data for the chart
  const chartData = useMemo(() => {
    const allDates = new Set([
      ...processedData.stories.map((item) => item.date),
      ...processedData.projects.map((item) => item.date),
      ...processedData.sprints.map((item) => item.date),
      ...processedData.spaces.map((item) => item.date),
    ]);

    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map((date) => {
      const storyCount =
        processedData.stories.find((item) => item.date === date)?.count || 0;
      const projectCount =
        processedData.projects.find((item) => item.date === date)?.count || 0;
      const sprintCount =
        processedData.sprints.find((item) => item.date === date)?.count || 0;
      const spaceCount =
        processedData.spaces.find((item) => item.date === date)?.count || 0;

      return {
        date: formatDateLabel(date, selectedRange),
        stories: storyCount,
        projects: projectCount,
        sprints: sprintCount,
        spaces: spaceCount,
        // Add total for debugging
        total: storyCount + projectCount + sprintCount + spaceCount,
      };
    });
  }, [processedData, selectedRange]);

  const getTimeRangeLabel = () => {
    switch (selectedRange) {
      case "daily":
        return "Daily Creation Trends";
      case "weekly":
        return "Weekly Creation Trends";
      case "monthly":
        return "Monthly Creation Trends";
      default:
        return "Creation Trends";
    }
  };

  return (
    <Card className="workspace-header-bg border workspace-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {getTimeRangeLabel()}
        </CardTitle>
        <Select
          value={selectedRange}
          onValueChange={(value) =>
            setSelectedRange(value as "daily" | "weekly" | "monthly")
          }
        >
          <SelectTrigger className="w-32 h-8 text-xs workspace-header-bg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily" className="text-xs">
              Daily
            </SelectItem>
            <SelectItem value="weekly" className="text-xs">
              Weekly
            </SelectItem>
            <SelectItem value="monthly" className="text-xs">
              Monthly
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full grid grid-cols-5 gap-3">
          <div className="col-span-3">
            <ResponsiveContainer width="100%" height="100%" className="text-xs">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="stories"
                  stackId="a"
                  fill="#54C601"
                  radius={[4, 4, 4, 4]}
                  name="Stories"
                />
                <Bar
                  dataKey="projects"
                  stackId="a"
                  fill="#007AFF"
                  radius={[4, 4, 4, 4]}
                  name="Projects"
                />
                <Bar
                  dataKey="sprints"
                  stackId="a"
                  fill="#8C57FF"
                  radius={[4, 4, 4, 4]}
                  name="Sprints"
                />
                <Bar
                  dataKey="spaces"
                  stackId="a"
                  fill="#8A8D93"
                  radius={[4, 4, 4, 4]}
                  name="Spaces"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Right Section: Summary Statistics */}
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              {/* Overall Balance */}
              <div className="mb-4">
                <div className="text-2xl font-bold">
                  {chartData.reduce(
                    (sum, item) =>
                      sum + item.stories + item.projects + item.sprints,
                    0
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Total creations this period
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500/10 rounded-md flex items-center justify-center p-2">
                      <SquareCheckBig className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {chartData.reduce((sum, item) => sum + item.stories, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Stories</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 rounded-md flex items-center justify-center p-2">
                      <Hash className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {chartData.reduce(
                          (sum, item) => sum + item.projects,
                          0
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total Projects
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/10 rounded-md flex items-center justify-center p-2">
                      <CirclePlay className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {chartData.reduce((sum, item) => sum + item.sprints, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Sprints</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-500/10 rounded-md flex items-center justify-center p-2">
                      <Layout className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {chartData.reduce((sum, item) => sum + item.spaces, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Spaces</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatDateLabel(dateStr: string, range: string): string {
  if (range === "daily") {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } else if (range === "weekly") {
    return dateStr; // Already in YYYY-Www format
  } else if (range === "monthly") {
    const date = new Date(dateStr + "-01");
    return date.toLocaleString(undefined, { year: "numeric", month: "short" });
  }
  return dateStr;
}

export default CreationTrendsChart;
