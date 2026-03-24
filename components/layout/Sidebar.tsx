"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Calendar, 
  Music, 
  Heart,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Members", href: "/dashboard/admin/members", icon: <Users className="h-5 w-5" /> },
    { label: "Financial", href: "/dashboard/admin/financial", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Reports", href: "/dashboard/admin/reports", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Settings", href: "/dashboard/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ],
  pastor: [
    { label: "Dashboard", href: "/dashboard/pastor", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Sermons", href: "/dashboard/pastor/sermons", icon: <Heart className="h-5 w-5" /> },
    { label: "Members", href: "/dashboard/pastor/members", icon: <Users className="h-5 w-5" /> },
    { label: "Events", href: "/dashboard/pastor/events", icon: <Calendar className="h-5 w-5" /> },
    { label: "Messages", href: "/dashboard/pastor/messages", icon: <Heart className="h-5 w-5" /> },
  ],
  member: [
    { label: "Dashboard", href: "/dashboard/member", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Giving", href: "/dashboard/member/giving", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Events", href: "/dashboard/member/events", icon: <Calendar className="h-5 w-5" /> },
    { label: "Groups", href: "/dashboard/member/groups", icon: <Users className="h-5 w-5" /> },
    { label: "Profile", href: "/dashboard/member/profile", icon: <Settings className="h-5 w-5" /> },
  ],
  treasurer: [
    { label: "Dashboard", href: "/dashboard/treasurer", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Giving", href: "/dashboard/treasurer/giving", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Expenses", href: "/dashboard/treasurer/expenses", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Reports", href: "/dashboard/treasurer/reports", icon: <BarChart3 className="h-5 w-5" /> },
  ],
  "praise-worship": [
    { label: "Dashboard", href: "/dashboard/praise-worship", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Songs", href: "/dashboard/praise-worship/songs", icon: <Music className="h-5 w-5" /> },
    { label: "Setlists", href: "/dashboard/praise-worship/setlists", icon: <Music className="h-5 w-5" /> },
    { label: "Team", href: "/dashboard/praise-worship/team", icon: <Users className="h-5 w-5" /> },
  ],
  ushering: [
    { label: "Dashboard", href: "/dashboard/ushering", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Check-in", href: "/dashboard/ushering/checkin", icon: <Users className="h-5 w-5" /> },
    { label: "Visitors", href: "/dashboard/ushering/visitors", icon: <Heart className="h-5 w-5" /> },
    { label: "Tasks", href: "/dashboard/ushering/tasks", icon: <Calendar className="h-5 w-5" /> },
  ],
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const items = navItems[role] || navItems.member;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-gray-900 text-white transition-transform md:relative md:z-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="font-bold">Hopewell</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            {user && (
              <div className="mb-4 text-sm text-gray-400">
                <p className="truncate font-semibold">{user.email}</p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
