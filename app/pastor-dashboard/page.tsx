"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Users, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PastorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pastor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage sermons, members, and pastoral care.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sermons Published</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-500">In your care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prayer Requests</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sermon Management</CardTitle>
            <CardDescription>Upload and schedule sermons</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">New Sermon</h4>
              <p className="text-sm text-gray-600">Upload a new sermon file</p>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pastoral Care</CardTitle>
            <CardDescription>Track pastoral visits and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Pastoral Notes</h4>
              <p className="text-sm text-gray-600">Manage pastoral care records</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}