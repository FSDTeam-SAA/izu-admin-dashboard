"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Column, DataTable } from "@/components/list/data-table";
import { NameCell } from "@/components/list/name-cell";
import { getCommissionReports } from "@/lib/api";
import type { CommissionReport } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const LIMIT = 12;

const columns: Column<CommissionReport>[] = [
  {
    key: "name",
    header: "User Name",
    render: (row) => <NameCell name={row.name} />,
  },
  {
    key: "email",
    header: "Email",
    render: (row) => (
      <span className="text-muted-foreground">{row.email}</span>
    ),
  },
  {
    key: "phone",
    header: "Phone Number",
    render: (row) => (
      <span className="text-muted-foreground">{row.phone || "—"}</span>
    ),
  },
  {
    key: "orders",
    header: "Total Order",
    render: (row) => row.completedOrder ?? 0,
  },
  {
    key: "gain",
    header: "Amount gain 10%",
    render: (row) => (
      <span className="font-medium">{formatCurrency(row.adminProfit)}</span>
    ),
  },
];

export default function CommissionReportsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "commission-reports", page],
    queryFn: () => getCommissionReports({ page, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });

  return (
    <Card className="overflow-hidden p-0">
      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        pagination={data?.pagination}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        rowKey={(row) => row._id}
        emptyMessage="No commission reports found."
      />
    </Card>
  );
}
