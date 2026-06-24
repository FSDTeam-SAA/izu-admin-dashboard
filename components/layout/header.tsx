"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Search, Settings, LogOut, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const fullName =
    [user?.name, user?.lastName].filter(Boolean).join(" ") || "Admin";

  return (
<<<<<<< HEAD
    <header className="header-background fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 px-4 text-white shadow-sm sm:gap-4 sm:px-6 lg:left-64">
=======
    <header className="sidebar-gradient sticky top-0 z-30 flex h-16 items-center gap-3 px-4 text-white sm:gap-4 sm:px-6">
>>>>>>> 84077981138d301b127f44047f72d4283161beb1
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
        <input
          type="search"
          placeholder="Search"
          className="h-10 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <Avatar className="h-9 w-9 border border-white/30">
            <AvatarImage src={user?.image ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-white/20 text-white">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">
            {fullName}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-white/70 sm:inline" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
