import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function MemberGivingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Giving</h1>
        <p className="text-gray-600 mt-2">Track your contributions and set giving goals.</p>
      </div>

      {/* Giving Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Given</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 45,000</div>
            <p className="text-xs text-gray-500">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Gift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 3,750</div>
            <p className="text-xs text-gray-500">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Giving Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 weeks</div>
            <p className="text-xs text-gray-500">Consistent giving</p>
          </CardContent>
        </Card>
      </div>

      {/* Give Now */}
      <Card>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>Give online securely</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Give via M-Pesa
            </Button>
            <Button className="w-full" variant="outline">
              Give via Card
            </Button>
            <Button className="w-full" variant="outline">
              Set up Recurring Giving
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Giving History */}
      <Card>
        <CardHeader>
          <CardTitle>Giving History</CardTitle>
          <CardDescription>Your recent contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold">Tithe</p>
                <p className="text-sm text-gray-600">Mar 17, 2024</p>
              </div>
              <p className="font-semibold text-green-600">+KES 5,000</p>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold">Offering</p>
                <p className="text-sm text-gray-600">Mar 10, 2024</p>
              </div>
              <p className="font-semibold text-green-600">+KES 2,500</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Building Fund</p>
                <p className="text-sm text-gray-600">Mar 3, 2024</p>
              </div>
              <p className="font-semibold text-green-600">+KES 10,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
