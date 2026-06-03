"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { PersonalInfo } from "@/components/settings/personal-info";
import { ChangePassword } from "@/components/settings/change-password";
import { getProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

type Tab = "personal" | "password";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("personal");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Setting</h1>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Setting</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setTab("personal")}
          className={cn(
            "rounded-lg border py-3.5 text-base font-semibold transition-colors",
            tab === "personal"
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-brand bg-background text-brand hover:bg-brand/5"
          )}
        >
          Personal Information
        </button>
        <button
          type="button"
          onClick={() => setTab("password")}
          className={cn(
            "rounded-lg border py-3.5 text-base font-semibold transition-colors",
            tab === "password"
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-brand bg-background text-brand hover:bg-brand/5"
          )}
        >
          Change Password
        </button>
      </div>

      {tab === "personal" ? (
        <PersonalInfo profile={profile} isLoading={isLoading} />
      ) : (
        <ChangePassword profile={profile} isLoading={isLoading} />
      )}
    </div>
  );
}
