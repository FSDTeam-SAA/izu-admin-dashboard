"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterSelect } from "@/components/ui/filter-select";
import { getTopServices } from "@/lib/api";

const COLORS = ["#2767b0", "#7aa9d9", "#c9def0", "#0e4c7e", "#aacbe8"];

export function TopServices() {
  const [filter, setFilter] = useState<"allTime" | "7days">("allTime");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "top-services", filter],
    queryFn: () => getTopServices(filter),
  });

  const services = (data ?? []).filter((s) => s.percentage > 0);
  const chartData = services.map((s) => ({
    name: s.title || "Untitled",
    value: s.percentage,
  }));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Top Performing Services</h3>
        <FilterSelect
          value={filter}
          onChange={(v) => setFilter(v as "allTime" | "7days")}
          options={[
            { label: "All time", value: "allTime" },
            { label: "Last 7 days", value: "7days" },
          ]}
        />
      </div>

      <div className="mt-4 flex h-56 items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-44 w-44 rounded-full" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {!isLoading && chartData.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
