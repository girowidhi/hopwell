import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PraiseWorshipSongsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Song Library</h1>
          <p className="text-gray-600 mt-2">Manage your worship songs collection.</p>
        </div>
        <Button>Add Song</Button>
      </div>

      {/* Search */}
      <Input placeholder="Search songs by title or artist..." />

      {/* Songs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Amazing Grace", artist: "John Newton", key: "G", genre: "Hymn" },
          { title: "How Great Thou Art", artist: "Carl Boberg", key: "D", genre: "Hymn" },
          { title: "Jesus Loves Me", artist: "Anna Bartlett Warner", key: "F", genre: "Children" },
        ].map((song, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{song.title}</CardTitle>
              <CardDescription>{song.artist}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Key: </span>
                  <span className="font-semibold">{song.key}</span>
                </div>
                <div>
                  <span className="text-gray-600">Genre: </span>
                  <span className="font-semibold">{song.genre}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button variant="outline" size="sm" className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
