"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {error.message || "An error occurred while processing your request."}
          </p>
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
