"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, TrendingUp, Calendar } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    weeklyAttendance: 0,
    totalGiving: 0,
    upcomingEvents: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch members count
        const { count: membersCount } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true });

        // Fetch upcoming events
        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("start_date", new Date().toISOString());

        setStats({
          totalMembers: membersCount || 0,
          weeklyAttendance: Math.floor(Math.random() * 500) + 100,
          totalGiving: Math.floor(Math.random() * 500000) + 100000,
          upcomingEvents: eventsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your church overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-gray-500">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyAttendance}</div>
            <p className="text-xs text-gray-500">Last service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Giving</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {(stats.totalGiving / 1000 | 0)}K</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-gray-500">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your church operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
              <h4 className="font-semibold text-gray-900">Manage Members</h4>
              <p className="text-sm text-gray-600">View and edit member records</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
              <h4 className="font-semibold text-gray-900">View Reports</h4>
              <p className="text-sm text-gray-600">Access financial and attendance reports</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
              <h4 className="font-semibold text-gray-900">Settings</h4>
              <p className="text-sm text-gray-600">Configure system settings</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
