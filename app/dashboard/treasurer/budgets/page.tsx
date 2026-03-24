"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { formatKES } from "@/lib/helpers";

interface Budget {
  id: string;
  name: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  fiscal_year: number;
  created_at: string;
}

export default function BudgetManagementPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    allocatedAmount: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchBudgets();
  }, [selectedYear]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("fiscal_year", selectedYear)
        .order("created_at");

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!formData.name || !formData.category || !formData.allocatedAmount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from("budgets").insert({
        name: formData.name,
        category: formData.category,
        allocated_amount: parseFloat(formData.allocatedAmount),
        spent_amount: 0,
        fiscal_year: selectedYear,
        created_by: user.id,
      });

      if (error) throw error;

      setFormData({
        name: "",
        category: "",
        allocatedAmount: "",
      });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      const { error } = await supabase.from("budgets").delete().eq("id", id);

      if (error) throw error;
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const calculatePercentage = (spent: number, allocated: number): number => {
    if (allocated === 0) return 0;
    return Math.round((spent / allocated) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading budgets...</p>
      </div>
    );
  }

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated_amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Budget Management</h2>
          <p className="text-gray-600">Plan and track church finances</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Budget
        </Button>
      </div>

      {/* Year Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button
              variant={selectedYear - 1 === new Date().getFullYear() - 1 ? "default" : "outline"}
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              {selectedYear - 1}
            </Button>
            <Button
              variant={selectedYear === new Date().getFullYear() ? "default" : "outline"}
              onClick={() => setSelectedYear(new Date().getFullYear())}
            >
              {selectedYear}
            </Button>
            <Button
              variant={selectedYear + 1 === new Date().getFullYear() + 1 ? "default" : "outline"}
              onClick={() => setSelectedYear(selectedYear + 1)}
            >
              {selectedYear + 1}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Allocated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatKES(totalAllocated)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatKES(totalSpent)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${totalRemaining < 0 ? "text-red-600" : ""}`}>
              {formatKES(totalRemaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                placeholder="e.g., Salaries, Operations"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full p-2 border rounded-md"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="salaries">Salaries & Staff</option>
                <option value="operations">Operations</option>
                <option value="maintenance">Building Maintenance</option>
                <option value="missions">Missions & Outreach</option>
                <option value="events">Events & Ceremonies</option>
                <option value="supplies">Supplies & Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="allocated">Allocated Amount (KES)</Label>
              <Input
                id="allocated"
                type="number"
                placeholder="0"
                value={formData.allocatedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, allocatedAmount: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddBudget} className="bg-green-600 hover:bg-green-700">
                Create Budget
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: "",
                    category: "",
                    allocatedAmount: "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No budgets for {selectedYear}. Create your first budget!
              </p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const percentage = calculatePercentage(budget.spent_amount, budget.allocated_amount);
            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{budget.name}</CardTitle>
                      <CardDescription>{budget.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Allocated</p>
                      <p className="font-bold">{formatKES(budget.allocated_amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spent</p>
                      <p className="font-bold">{formatKES(budget.spent_amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining</p>
                      <p
                        className={`font-bold ${
                          budget.allocated_amount - budget.spent_amount < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {formatKES(budget.allocated_amount - budget.spent_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 100 ? "bg-red-600" : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{percentage}% spent</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
