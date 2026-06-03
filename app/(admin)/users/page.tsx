"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Column, DataTable } from "@/components/list/data-table";
import { NameCell } from "@/components/list/name-cell";
import { getUserList } from "@/lib/api";
import type { UserListItem } from "@/lib/types";

const LIMIT = 12;

const columns: Column<UserListItem>[] = [
  {
    key: "id",
    header: "User ID",
    render: (row) => (
      <span className="text-muted-foreground">
        {row._id ? row._id.slice(-6).toUpperCase() : "—"}
      </span>
    ),
  },
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
    render: (row) => row.totalCompletedOrder ?? 0,
  },
];

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getUserList({ page, limit: LIMIT }),
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
        emptyMessage="No users found."
      />
    </Card>
  );
}
