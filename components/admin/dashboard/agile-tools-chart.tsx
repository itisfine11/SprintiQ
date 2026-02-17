"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface AgileToolsChartProps {
  data: Array<{
    tool: string | string[];
    count: number;
    percentage: number;
  }>;
}

const COLORS = [
  "#10b981", // emerald
  "#8b5cf6", // purple
  "#ef4444", // red
  "#f59e0b", // yellow
  "#06b6d4", // light blue
  "#84cc16", // lime
  "#f97316", // orange
  "#3b82f6", // blue
];

const AgileToolsChart: React.FC<AgileToolsChartProps> = ({ data }) => {
  // Process the data to handle arrays of tools
  const processedData = React.useMemo(() => {
    const toolsCount: { [key: string]: number } = {};

    data.forEach((item) => {
      if (!item.tool) {
        toolsCount["Not Specified"] =
          (toolsCount["Not Specified"] || 0) + item.count;
        return;
      }

      try {
        // Check if tool is a JSON string (array)
        let tools: string[] = [];

        if (typeof item.tool === "string") {
          // Try to parse as JSON first (for array format)
          try {
            const parsed = JSON.parse(item.tool);
            if (Array.isArray(parsed)) {
              tools = parsed;
            } else {
              // Single tool as string
              tools = [item.tool];
            }
          } catch {
            // If parsing fails, treat as single tool string
            tools = [item.tool];
          }
        } else if (Array.isArray(item.tool)) {
          tools = item.tool;
        } else {
          tools = [String(item.tool)];
        }

        // Count each individual tool
        tools.forEach((tool) => {
          if (tool && tool.trim()) {
            const cleanTool = tool.trim();
            toolsCount[cleanTool] = (toolsCount[cleanTool] || 0) + item.count;
          }
        });
      } catch (error) {
        console.error("Error processing agile tools:", error, item.tool);
        toolsCount["Error Processing"] =
          (toolsCount["Error Processing"] || 0) + item.count;
      }
    });

    // Convert to array and sort by count
    return Object.entries(toolsCount)
      .map(([tool, count]) => ({
        tool,
        count,
        percentage: 0, // We'll calculate this after processing
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const totalUsers = processedData.reduce((sum, item) => sum + item.count, 0);
  const totalPercentage = processedData.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  const [hoveredSegment, setHoveredSegment] = useState<any>(null);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Calculate percentages after processing
  const dataWithPercentages = React.useMemo(() => {
    return processedData.map((item) => ({
      ...item,
      percentage:
        totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0,
    }));
  }, [processedData, totalUsers]);

  // Add index to each data item
  const dataWithIndex = dataWithPercentages.map((item, index) => ({
    ...item,
    index,
  }));

  const handleMouseEnter = (entry: any) => {
    setHoveredSegment(entry);
    setTooltipData(entry);
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    setTooltipData(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltipData) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <Card
      className="shadow-sm workspace-header-bg border workspace-border"
      onMouseMove={handleMouseMove}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">
            Using agile tools
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Total users using agile tools
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-lg font-bold mb-1">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Users</div>
        </div>

        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithIndex}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={60}
                paddingAngle={5}
                cornerRadius={5}
                dataKey="count"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {dataWithIndex.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text - changes based on hover */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {hoveredSegment ? (
              <>
                <div className="text-xl font-bold text-gray-900">
                  {hoveredSegment.count.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {hoveredSegment.tool}
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold">
                  {dataWithPercentages.reduce(
                    (sum, tool) => sum + tool.count,
                    0
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Total Tools</div>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* Summary Statistics */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {processedData.length}
            </div>
            <div className="text-muted-foreground">Unique Tools</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {dataWithPercentages.reduce((sum, tool) => sum + tool.count, 0)}
            </div>
            <div className="text-muted-foreground">Total Tools</div>
          </div>
        </div>
      </div>

      {/* Custom tooltip positioned outside chart */}
      {tooltipData && mousePosition.x > 0 && (
        <div
          className="fixed rounded-sm p-2 shadow-lg pointer-events-none bg-white border border-gray-200"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
            zIndex: 9999,
          }}
        >
          <p className="text-xs font-semibold text-gray-900">
            {tooltipData.tool}
          </p>
          <p className="text-xs text-gray-600">
            Users: {tooltipData.count.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            Percentage: {tooltipData.percentage}%
          </p>
        </div>
      )}
    </Card>
  );
};

export default AgileToolsChart;
