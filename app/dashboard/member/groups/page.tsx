"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Plus, Settings } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  group_type: string;
  leader_id: string;
  image_url?: string;
  member_count?: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [userGroups, setUserGroups] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchGroups();
    fetchUserGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Get member count for each group
      const groupsWithCount = await Promise.all(
        (data || []).map(async (group) => {
          const { count } = await supabase
            .from("group_members")
            .select("*", { count: "exact" })
            .eq("group_id", group.id);
          return { ...group, member_count: count || 0 };
        })
      );

      setGroups(groupsWithCount);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGroups = async () => {
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

      // Get user's groups
      const { data } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("member_id", memberData.id);

      setUserGroups((data || []).map((g) => g.group_id));
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
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

      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        member_id: memberData.id,
        role: "member",
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;

      setUserGroups([...userGroups, groupId]);
      fetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to leave this group?")) {
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

      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("member_id", memberData.id);

      if (error) throw error;

      setUserGroups(userGroups.filter((g) => g !== groupId));
      fetchGroups();
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Groups & Communities</h2>
          <p className="text-gray-600">Connect with other members in your community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No groups available yet</p>
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => {
            const isMember = userGroups.includes(group.id);
            return (
              <Card key={group.id} className="flex flex-col">
                {group.image_url && (
                  <div
                    className="h-32 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${group.image_url})` }}
                  />
                )}
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription>{group.group_type}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{group.member_count} members</span>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  {isMember ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      Leave Group
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Join Group
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
