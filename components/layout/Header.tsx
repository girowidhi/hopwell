"use client";

import { useState } from "react";
import { Menu, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  userProfile?: UserProfile | null;
}

export function Header({ onMenuClick, userProfile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userProfile");
    router.push("/login");
  };

  const userName = userProfile?.first_name 
    ? `${userProfile.first_name} ${userProfile.last_name || ""}`.trim()
    : userProfile?.email?.split("@")[0] || "User";

  const roleLabel = userProfile?.role 
    ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1).replace("-", " ")
    : "";

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 md:flex-none" />
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          
          {/* User Profile Dropdown - Role not displayed for security */}
          {userProfile && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#C9A87C] flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userProfile.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
