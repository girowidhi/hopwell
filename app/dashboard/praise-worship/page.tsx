"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Calendar, ListMusic } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PraiseWorshipDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Praise & Worship Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage songs, setlists, and worship team.</p>
      </div>

      {/* Worship Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Songs Library</CardTitle>
            <Music className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-gray-500">Total songs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setlists</CardTitle>
            <ListMusic className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">Created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Rehearsal</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days</div>
            <p className="text-xs text-gray-500">Wednesday 7 PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Worship Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Song Library</h4>
          <p className="text-sm text-gray-600">Browse and manage songs</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Create Setlist</h4>
          <p className="text-sm text-gray-600">Plan service music</p>
        </button>
        <button className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left">
          <h4 className="font-semibold text-gray-900">Team Schedule</h4>
          <p className="text-sm text-gray-600">Manage rehearsals and services</p>
        </button>
      </div>
    </div>
  );
}
