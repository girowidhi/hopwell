"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Heart, Calendar } from "lucide-react";

export default function UsheringDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ushering & Hospitality Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage check-ins, visitors, and hospitality tasks.</p>
      </div>

      {/* Ushering Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-Ins Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-gray-500">Current service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">On duty today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Ushering Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">QR Check-In</h4>
          <p className="text-sm text-gray-600">Scan QR codes to check in</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Visitor Management</h4>
          <p className="text-sm text-gray-600">Track and follow up with visitors</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Hospitality Tasks</h4>
          <p className="text-sm text-gray-600">Manage daily hospitality duties</p>
        </button>
      </div>
    </div>
  );
}
