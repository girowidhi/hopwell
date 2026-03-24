import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemberEventsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Church Events</h1>
        <p className="text-gray-600 mt-2">Browse and register for upcoming events.</p>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you haven't registered for yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Sunday Service",
                date: "Mar 24, 2024 • 10:00 AM",
                location: "Main Sanctuary",
                registered: true,
              },
              {
                title: "Bible Study",
                date: "Mar 26, 2024 • 7:00 PM",
                location: "Fellowship Hall",
                registered: false,
              },
              {
                title: "Youth Retreat",
                date: "Apr 6-8, 2024",
                location: "Nairobi Conference Center",
                registered: false,
              },
            ].map((event, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                  {event.registered ? (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Registered
                    </span>
                  ) : (
                    <Button size="sm">Register</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Registrations</CardTitle>
          <CardDescription>Events you're registered for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { title: "Sunday Service", count: "12 times this month" },
              { title: "Prayer Meeting", count: "Registered" },
            ].map((item, idx) => (
              <button
                key={idx}
                className="w-full text-left border rounded-lg p-3 hover:bg-gray-50"
              >
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.count}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
