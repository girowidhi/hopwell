import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PastorSermonsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sermon Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage your sermons.</p>
        </div>
        <Button>Upload Sermon</Button>
      </div>

      {/* Recent Sermons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sermons</CardTitle>
          <CardDescription>Your latest sermon uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start  mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">The Power of Faith</h4>
                  <p className="text-sm text-gray-600">Preached on 2024-03-17</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Published</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">A powerful message about trusting God in difficult times.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">Loving Your Neighbor</h4>
                  <p className="text-sm text-gray-600">Preached on 2024-03-10</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Published</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Understanding Jesus' command to love our neighbors as ourselves.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sermon Series */}
      <Card>
        <CardHeader>
          <CardTitle>Sermon Series</CardTitle>
          <CardDescription>Organize your sermons into series</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button className="w-full text-left border rounded-lg p-3 hover:bg-gray-50">
              <h4 className="font-semibold">Foundations of Faith</h4>
              <p className="text-sm text-gray-600">8 sermons • Jan - Mar 2024</p>
            </button>
            <button className="w-full text-left border rounded-lg p-3 hover:bg-gray-50">
              <h4 className="font-semibold">Books of the Bible</h4>
              <p className="text-sm text-gray-600">12 sermons • Apr - Dec 2024</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
