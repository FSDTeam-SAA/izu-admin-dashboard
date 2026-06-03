"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, UserCog, ShoppingBag, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatistics } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function StatCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "statistics"],
    queryFn: getStatistics,
  });

  const cards = [
    {
      title: "Total Users",
      value: formatNumber(data?.totalUser),
      caption: "Registered users",
      icon: Users,
    },
    {
      title: "Total Service Providers",
      value: formatNumber(data?.totalProvider),
      caption: "Active providers",
      icon: UserCog,
    },
    {
      title: "Total Orders",
      value: formatNumber(data?.totalOrder),
      caption: "Completed orders",
      icon: ShoppingBag,
    },
    {
      title: "Total Earnings",
      value: formatCurrency(data?.totalAdminEarning),
      caption: "Admin commission (10%)",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-9 w-28" />
            ) : (
              <p className="mt-3 text-3xl font-bold text-primary">
                {card.value}
              </p>
            )}
            <p className="mt-4 text-right text-xs text-muted-foreground">
              {card.caption}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
