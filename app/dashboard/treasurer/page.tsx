"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TreasurerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Treasurer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage church finances and giving.</p>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Giving</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 1.2M</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 450K</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 1.5M</div>
            <p className="text-xs text-gray-500">Allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 2.8M</div>
            <p className="text-xs text-gray-500">Current</p>
          </CardContent>
        </Card>
      </div>

      {/* Treasurer Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest giving and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">Tithe - John Doe</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <p className="text-green-600 font-semibold">+KES 5,000</p>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">Utilities Payment</p>
                  <p className="text-sm text-gray-600">Yesterday</p>
                </div>
                <p className="text-red-600 font-semibold">-KES 15,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 w-full text-left text-sm">
              Record Giving
            </button>
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 w-full text-left text-sm">
              Record Expense
            </button>
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 w-full text-left text-sm">
              Generate Report
            </button>
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 w-full text-left text-sm">
              M-Pesa Integration
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
