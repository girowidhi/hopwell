"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, Calendar, Users } from "lucide-react";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your spiritual community!</p>
      </div>

      {/* Member Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Giving</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 45,000</div>
            <p className="text-xs text-gray-500">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500">Services attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Active groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">Registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">My Profile</h4>
          <p className="text-sm text-gray-600">View and update your profile</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Give Online</h4>
          <p className="text-sm text-gray-600">Make a donation securely</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Events</h4>
          <p className="text-sm text-gray-600">Browse and register for events</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Groups</h4>
          <p className="text-sm text-gray-600">Join small groups and discussions</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Prayer Requests</h4>
          <p className="text-sm text-gray-600">Submit your prayer requests</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Sermons</h4>
          <p className="text-sm text-gray-600">Watch past sermons anytime</p>
        </button>
      </div>
    </div>
  );
}
