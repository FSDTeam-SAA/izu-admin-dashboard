"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterSelect } from "@/components/ui/filter-select";
import { getRevenueByMonth } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-muted-foreground">{label}</p>
      <p className="font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart() {
  const [year, setYear] = useState(String(CURRENT_YEAR));

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "revenue", year],
    queryFn: () => getRevenueByMonth(Number(year)),
  });

  const total = useMemo(
    () => (data ?? []).reduce((sum, point) => sum + point.revenue, 0),
    [data]
  );

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Revenue</h3>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-32" />
          ) : (
            <p className="mt-1 text-2xl font-bold">{formatCurrency(total)}</p>
          )}
        </div>
        <FilterSelect
          value={year}
          onChange={setYear}
          options={YEARS.map((y) => ({ label: String(y), value: String(y) }))}
        />
      </div>

      <div className="mt-4 h-72 w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2767b0" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#2767b0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${value / 1000}K` : `${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2767b0"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
