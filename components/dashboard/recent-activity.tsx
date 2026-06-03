"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterSelect } from "@/components/ui/filter-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentActivity } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentActivity() {
  const [days, setDays] = useState<"1" | "7">("1");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "recent-activity", days],
    queryFn: () => getRecentActivity(Number(days) as 1 | 7),
  });

  const rows = data ?? [];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <FilterSelect
          value={days}
          onChange={(v) => setDays(v as "1" | "7")}
          options={[
            { label: "Last 24h", value: "1" },
            { label: "Last 7 days", value: "7" },
          ]}
        />
      </div>

      <div className="mt-3">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Service Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No recent activity found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="font-medium">
                    {row.userId?.name ?? "—"}
                  </TableCell>
                  <TableCell>{row.providerId?.name ?? "—"}</TableCell>
                  <TableCell>
                    {row.serviceId?.serviceDetails?.title ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(row.totalPrice)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
