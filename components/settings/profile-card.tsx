"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

interface ProfileCardProps {
  profile?: Profile;
  isLoading: boolean;
  previewImage?: string | null;
}

export function ProfileCard({
  profile,
  isLoading,
  previewImage,
}: ProfileCardProps) {
  const fullName =
    [profile?.name, profile?.lastName].filter(Boolean).join(" ") || "Admin";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      {isLoading ? (
        <Skeleton className="h-20 w-20 rounded-full" />
      ) : (
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={previewImage || profile?.profileImage || undefined}
            alt={fullName}
          />
          <AvatarFallback className="text-xl">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-1">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-sm text-muted-foreground">
              @{profile?.accountType ?? "admin"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
