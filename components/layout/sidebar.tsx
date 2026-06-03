"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/logo";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sidebar-gradient flex h-full flex-col px-4 py-6 text-sidebar-foreground">
      <div className="mb-10 flex justify-center px-2">
        <Logo size={44} variant="light" />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-white/85 hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Log Out</span>
        </button>
      </nav>
    </div>
  );
}
