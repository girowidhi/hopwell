"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const data = localStorage.getItem("pendingSignup");
    if (data) {
      setSignupData(JSON.parse(data));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!signupData) {
        toast({
          title: "Error",
          description: "Signup data not found",
          variant: "destructive",
        });
        router.push("/auth/signup");
        return;
      }

      // Verify OTP and create member profile
      // In a real application, you'd call an Edge Function here to verify the OTP
      // For now, we'll assume verification is successful

      // Call Edge Function to create member profile
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          ...signupData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Clear localStorage
      localStorage.removeItem("pendingSignup");

      toast({
        title: "Success",
        description: "Account verified successfully",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>Enter the OTP sent to your email and phone</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button className="text-blue-600 hover:underline">
            Resend OTP
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
