"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import type { PaginationMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  isLoading: boolean;
  isError?: boolean;
  pagination?: PaginationMeta;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  isError,
  pagination,
  page,
  limit,
  onPageChange,
  rowKey,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const start = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: limit }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    <Skeleton className="h-5 w-full max-w-40" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center text-destructive"
              >
                Failed to load data. Please try again.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn(col.className)}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `Showing ${start} to ${end} of ${totalItems} results`}
        </p>
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
