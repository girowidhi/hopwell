"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Role to dashboard path mapping
const getDashboardPath = (role: string): string => {
  const paths: Record<string, string> = {
    admin: "/admin-dashboard",
    pastor: "/pastor-dashboard",
    treasurer: "/treasurer-dashboard",
    secretary: "/secretary-dashboard",
    member: "/member-dashboard",
    "praise-worship": "/dashboard/praise-worship",
    ushering: "/dashboard/ushering",
  };
  return paths[role] || "/member-dashboard";
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const redirectToDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get user role from members table (role column)
      const { data: memberData } = await supabase
        .from("members")
        .select("role")
        .eq("user_id", user.id)
        .single();

      // Fallback to user_roles table if not found in members
      let userRole = "member";
      if (memberData?.role) {
        userRole = memberData.role;
      } else {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        
        if (roleData?.role) {
          userRole = roleData.role;
        }
      }

      // Redirect to role-based dashboard
      router.push(getDashboardPath(userRole));
    };

    redirectToDashboard();
  }, [router, supabase]);

  return <div className="min-h-screen bg-[#0F1525] flex items-center justify-center">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-[#C9A87C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Redirecting you to your dashboard...</p>
    </div>
  </div>;
}
