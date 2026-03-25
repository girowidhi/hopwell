"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Mail, MessageSquare, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SecretaryDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Secretary Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage church administration and communications.</p>
      </div>

      {/* Secretary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-500">In database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">New messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Secretary Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>Manage member records and registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">View Members</h4>
              <p className="text-sm text-gray-600">Browse all member records</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Add New Member</h4>
              <p className="text-sm text-gray-600">Register a new church member</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Membership Requests</h4>
              <p className="text-sm text-gray-600">Review pending applications</p>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communications</CardTitle>
            <CardDescription>Manage church communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Send Announcement</h4>
              <p className="text-sm text-gray-600">Broadcast to congregation</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Manage Calendar</h4>
              <p className="text-sm text-gray-600">Schedule events and services</p>
            </button>
            <button className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 w-full text-left">
              <h4 className="font-semibold text-gray-900">Generate Reports</h4>
              <p className="text-sm text-gray-600">Create attendance and membership reports</p>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Latest updated records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Membership Application - Jane Doe</p>
                  <p className="text-sm text-gray-500">Updated 2 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Attendance Report - Jan 2024</p>
                  <p className="text-sm text-gray-500">Updated yesterday</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Event Registration - Sunday Service</p>
                  <p className="text-sm text-gray-500">Updated 3 days ago</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}