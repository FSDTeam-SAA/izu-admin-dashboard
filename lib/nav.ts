import {
  LayoutDashboard,
  Users,
  UserCog,
  ReceiptText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "User List", href: "/users", icon: Users },
  { label: "Provider List", href: "/providers", icon: UserCog },
  { label: "Commission Reports", href: "/commission-reports", icon: ReceiptText },
  { label: "Settings", href: "/settings", icon: Settings },
];
