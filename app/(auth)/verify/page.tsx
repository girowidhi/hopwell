"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader, CheckCircle, ArrowLeft, Mail, Clock, RefreshCw } from "lucide-react";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [signupData, setSignupData] = useState<{
    userId?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  const pendingEmail = searchParams.get("email");

  useEffect(() => {
    const data = localStorage.getItem("pendingSignup");
    if (data) {
      setSignupData(JSON.parse(data));
    } else if (pendingEmail) {
      setSignupData({ email: pendingEmail, firstName: "", lastName: "", phone: "" });
    }
  }, [pendingEmail]);

  useEffect(() => {
    if (!canResend || countdown > 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canResend, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter the 6-digit verification code");
      setShowErrorModal(true);
      return;
    }

    if (!signupData?.email) {
      toast({
        title: "Error",
        description: "Verification data not found. Please sign up again.",
        variant: "destructive",
      });
      router.push("/signup");
      return;
    }

    setIsLoading(true);

    try {
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
        
        if (response.status === 401) {
          setErrorMessage("Invalid verification code. Please check and try again.");
        } else if (response.status === 410) {
          setErrorMessage("Verification code has expired. Please request a new one.");
        } else {
          throw new Error(error.message);
        }
        setShowErrorModal(true);
        return;
      }

      localStorage.removeItem("pendingSignup");
      localStorage.removeItem("pendingVerificationEmail");

      setShowSuccessModal(true);
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !signupData?.email) return;

    setIsResending(true);
    
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to resend code");
      }

      setCountdown(60);
      setCanResend(false);

      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("rate limit")) {
        setCountdown(60);
        setCanResend(false);
        setErrorMessage("Too many requests. Please wait 60 seconds before requesting a new code.");
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Failed to resend code");
      }
      setShowErrorModal(true);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleSubmit(new Event("submit") as any);
    }
  }, [otp]);

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Mail className="h-6 w-6 text-[#C9A87C]" />
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {signupData?.email && (
            <div className="text-center p-3 bg-[#0A0F1E]/50 rounded-lg border border-[#C9A87C]/10">
              <p className="text-sm text-gray-400">
                Code sent to: <span className="text-white font-semibold">{signupData.email}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-300 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-[#C9A87C]" />
                Verification Code
              </Label>
              <div className="flex justify-center">
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-[0.5em] h-12 w-48 bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-600 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  aria-label="Verification code"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-center text-gray-500">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A87C]/20" 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>

          <div className="space-y-4">
            {countdown > 0 && (
              <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 animate-in slide-in-from-top-1">
                <p className="text-sm text-amber-400 flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  Resend in <span className="font-semibold">{countdown}</span> seconds
                </p>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResend}
                disabled={isResending || !canResend || countdown > 0 || !signupData?.email}
                className="text-sm text-[#C9A87C] hover:text-[#B8956A]"
              >
                {isResending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className={`mr-2 h-4 w-4 ${!canResend ? "opacity-50" : ""}`} />
                )}
                Resend Code
              </Button>
            </div>

            <div className="pt-4 border-t border-[#C9A87C]/10">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-[#C9A87C] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1525] border border-green-500/20 rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email Verified!</h3>
              <p className="text-gray-400 mb-4">Your account has been verified successfully. Redirecting you to sign in...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A87C]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1525] border border-red-500/20 rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Verification Failed</h3>
              <p className="text-gray-400 mb-4">{errorMessage}</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => setShowErrorModal(false)} 
                  variant="outline"
                  className="w-full border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10"
                >
                  Try Again
                </Button>
                {errorMessage.includes("expired") && (
                  <Button 
                    onClick={handleResend}
                    disabled={isResending || !canResend}
                    className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E]"
                  >
                    {isResending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Request New Code
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
