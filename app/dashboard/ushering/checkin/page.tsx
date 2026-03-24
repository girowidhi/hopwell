import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UsheringCheckInPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QR Check-In</h1>
        <p className="text-gray-600 mt-2">Check in members using QR codes.</p>
      </div>

      {/* QR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>Point camera at member QR code to check in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border-2 border-dashed outline rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">Camera/QR Scanner Widget</p>
            <p className="text-sm text-gray-500">QR scanner would be displayed here</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-Ins */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Check-Ins</CardTitle>
          <CardDescription>Members checked in today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "John Doe", time: "09:15 AM", status: "Checked In" },
              { name: "Jane Smith", time: "09:22 AM", status: "Checked In" },
              { name: "Peter Johnson", time: "09:35 AM", status: "Checked In" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.time}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">432</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Check-In Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
