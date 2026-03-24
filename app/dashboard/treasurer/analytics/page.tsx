"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { formatKES } from "@/lib/helpers";

interface GivingStats {
  totalGiving: number;
  averageDonation: number;
  donationCount: number;
  monthlyGiving: Array<{
    month: string;
    amount: number;
  }>;
  givingByType: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function GivingAnalyticsPage() {
  const [stats, setStats] = useState<GivingStats | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchGivingStats();
  }, []);

  const fetchGivingStats = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get member ID
      const { data: memberData } = await supabase
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!memberData) return;

      // Get all transactions
      const { data: transactions } = await supabase
        .from("giving_transactions")
        .select("*")
        .eq("member_id", memberData.id)
        .eq("status", "completed")
        .order("transaction_date", { ascending: true });

      if (!transactions) return;

      // Calculate total and average
      const totalGiving = transactions.reduce((sum, t) => sum + t.amount, 0);
      const averageDonation = transactions.length > 0 ? totalGiving / transactions.length : 0;

      // Group by month
      const monthlyMap: Record<string, number> = {};
      transactions.forEach((t) => {
        const date = new Date(t.transaction_date);
        const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        monthlyMap[month] = (monthlyMap[month] || 0) + t.amount;
      });

      const monthlyGiving = Object.entries(monthlyMap).map(([month, amount]) => ({
        month,
        amount,
      }));

      // Group by type
      const typeMap: Record<string, number> = {};
      transactions.forEach((t) => {
        const type = t.giving_type.replace(/_/g, " ");
        typeMap[type] = (typeMap[type] || 0) + t.amount;
      });

      const givingByType = Object.entries(typeMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      setStats({
        totalGiving,
        averageDonation,
        donationCount: transactions.length,
        monthlyGiving,
        givingByType,
      });
    } catch (error) {
      console.error("Error fetching giving stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading giving analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No giving data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Giving Analytics</h2>
        <p className="text-gray-600">Track your generosity and giving patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Giving</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatKES(stats.totalGiving)}</p>
            <p className="text-xs text-gray-600 mt-1">{stats.donationCount} donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Average Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatKES(stats.averageDonation)}</p>
            <p className="text-xs text-gray-600 mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.donationCount}</p>
            <p className="text-xs text-gray-600 mt-1">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Giving Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Giving</CardTitle>
            <CardDescription>Your giving pattern over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyGiving}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatKES(value as number)} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Giving by Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Giving by Type</CardTitle>
            <CardDescription>Breakdown of giving categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.givingByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatKES(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.givingByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatKES(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Giving Table */}
      <Card>
        <CardHeader>
          <CardTitle>Giving Breakdown</CardTitle>
          <CardDescription>Details of your giving by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.givingByType.map((type, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{type.name}</span>
                <span className="text-lg font-bold">{formatKES(type.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
