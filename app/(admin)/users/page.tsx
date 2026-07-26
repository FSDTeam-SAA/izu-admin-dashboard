"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Column, DataTable } from "@/components/list/data-table";
import { NameCell } from "@/components/list/name-cell";
import {
  deleteUser,
  getUserList,
  grantProviderStatus,
  revokeProviderStatus,
  updateUserSuspension,
  updateUserVerification,
} from "@/lib/api";
import { getErrorMessage } from "@/lib/axios";
import type { UserListItem } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LIMIT = 12;

type UserAction =
  | "suspend"
  | "unsuspend"
  | "verify"
  | "unverify"
  | "grant-provider"
  | "revoke-provider"
  | "delete";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isSuperAdmin = session?.role === "super_admin";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getUserList({ page, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: async ({
      action,
      user,
    }: {
      action: UserAction;
      user: UserListItem;
    }) => {
      if (action === "suspend") return updateUserSuspension(user._id, true);
      if (action === "unsuspend") return updateUserSuspension(user._id, false);
      if (action === "verify") return updateUserVerification(user._id, true);
      if (action === "unverify") return updateUserVerification(user._id, false);
      if (action === "grant-provider") return grantProviderStatus(user._id);
      if (action === "revoke-provider") return revokeProviderStatus(user._id);
      return deleteUser(user._id);
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "providers"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update user"));
    },
  });

  const runAction = (action: UserAction, user: UserListItem) => {
    if (action === "delete") {
      const confirmed = window.confirm(
        `Delete ${user.name || user.email}? This cannot be undone.`
      );
      if (!confirmed) return;
    }
    mutation.mutate({ action, user });
  };

  const columns: Column<UserListItem>[] = [
    {
      key: "id",
      header: "User ID",
      render: (row) => (
        <span className="text-muted-foreground">
          {row._id ? row._id.slice(-6).toUpperCase() : "-"}
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
        <span className="text-muted-foreground">{row.phone || "-"}</span>
      ),
    },
    {
      key: "role",
      header: "Type",
      render: (row) => (
        <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold capitalize text-secondary-foreground">
          {row.accountType}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <span
            className={
              row.isSuspended
                ? "rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive"
                : "rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
            }
          >
            {row.isSuspended ? "Suspended" : "Active"}
          </span>
          <span
            className={
              row.isVerified
                ? "rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700"
                : "rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground"
            }
          >
            {row.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Total Order",
      render: (row) => row.totalCompletedOrder ?? 0,
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={!isSuperAdmin || mutation.isPending}
              aria-label={`Manage ${row.name || row.email}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                runAction(row.isSuspended ? "unsuspend" : "suspend", row)
              }
            >
              {row.isSuspended ? <ShieldCheck /> : <ShieldOff />}
              {row.isSuspended ? "Unsuspend" : "Suspend"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                runAction(row.isVerified ? "unverify" : "verify", row)
              }
            >
              {row.isVerified ? <UserX /> : <UserCheck />}
              {row.isVerified ? "Unverify" : "Verify"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                runAction(
                  row.accountType === "provider"
                    ? "revoke-provider"
                    : "grant-provider",
                  row
                )
              }
            >
              {row.accountType === "provider" ? <UserX /> : <UserCheck />}
              {row.accountType === "provider"
                ? "Revoke provider"
                : "Grant provider"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => runAction("delete", row)}
            >
              <Trash2 />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
