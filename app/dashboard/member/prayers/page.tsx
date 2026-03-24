"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Edit2, Trash2, Plus } from "lucide-react";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  is_private: boolean;
  status: string;
  created_at: string;
}

export default function PrayerRequestsPage() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPrivate, setIsPrivate] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("prayer_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    try {
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

      const { error } = await supabase.from("prayer_requests").insert({
        member_id: memberData.id,
        title,
        description,
        category,
        is_private: isPrivate,
        status: "active",
      });

      if (error) throw error;

      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchPrayerRequests();
    } catch (error) {
      console.error("Error adding prayer request:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer request?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("prayer_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchPrayerRequests();
    } catch (error) {
      console.error("Error deleting prayer request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading prayer requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Prayer Requests</h2>
          <p className="text-gray-600">Share prayer needs with the community</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Prayer Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Prayer request title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Describe your prayer request"
                className="w-full h-32 p-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="health">Health</option>
                  <option value="family">Family</option>
                  <option value="work">Work</option>
                  <option value="financial">Financial</option>
                  <option value="spiritual">Spiritual</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddRequest} className="bg-blue-600 hover:bg-blue-700">
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                  setDescription("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {prayerRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No prayer requests yet. Be the first to share!
              </p>
            </CardContent>
          </Card>
        ) : (
          prayerRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{request.title}</CardTitle>
                    <CardDescription>
                      {request.category} • {request.is_private ? "Private" : "Public"} •{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-red-100 rounded"
                      onClick={() => handleDelete(request.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{request.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
