"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

      // Get user role and redirect
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data?.role) {
        router.push(`/dashboard/${data.role}`);
      } else {
        router.push("/dashboard/member");
      }
    };

    redirectToDashboard();
  }, [router, supabase]);

  return <div>Redirecting...</div>;
}
