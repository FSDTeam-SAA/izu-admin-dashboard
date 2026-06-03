"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageItems(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 1) return [1];
  const items: (number | "...")[] = [1];

  if (page > 3) items.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) items.push(i);

  if (page < totalPages - 2) items.push("...");

  if (totalPages > 1) items.push(totalPages);

  return items.filter(
    (item, index, arr) => item !== arr[index - 1]
  ) as (number | "...")[];
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const items = getPageItems(page, totalPages);

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none hover:bg-muted";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label="Previous page"
        className={btn}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {items.map((item, index) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 min-w-9 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn(
              btn,
              page === item &&
                "border-primary bg-primary text-primary-foreground hover:bg-primary"
            )}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        className={btn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
