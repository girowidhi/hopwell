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
import { AlertCircle, ArrowLeft, Mail, Loader, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const locked = searchParams.get("locked");
    const retryAfter = searchParams.get("retryAfter");
    
    if (locked === "true" && retryAfter) {
      const seconds = parseInt(retryAfter);
      setCountdown(seconds);
      setCanResend(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          setCountdown(60);
          setCanResend(false);
          
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setCanResend(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait before trying again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Email Sent",
        description: "Password reset link has been resent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          setErrorMessage("Too many reset attempts. Please wait 60 seconds before trying again.");
          setShowErrorModal(true);
          
          setCountdown(60);
          setCanResend(false);
          
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setCanResend(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          setIsLoading(false);
          return;
        }

        if (error.message.includes("User not found")) {
          setErrorMessage("No account found with this email address.");
          setShowErrorModal(true);
          setIsLoading(false);
          return;
        }

        throw error;
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C9A87C]" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({});
                  }
                }}
                className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                style={{ 
                  boxShadow: errors.email ? "0 0 0 1px #ef4444" : "none"
                }}
                aria-invalid={!!errors.email}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p 
                  className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A87C]/20" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {countdown > 0 && (
              <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-sm text-amber-400">
                  Resend in <span className="font-semibold">{countdown}</span> seconds
                </p>
              </div>
            )}

            {email && canResend && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={isLoading || !email}
                  className="text-sm text-[#C9A87C] hover:text-[#B8956A]"
                >
                  {isLoading ? <Loader className="mr-1 h-4 w-4 animate-spin" /> : null}
                  Resend Link
                </Button>
              </div>
            )}

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
          <div className="bg-[#0F1525] border border-[#C9A87C]/20 rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
              <p className="text-gray-400 mb-4">
                We've sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <Button 
                onClick={() => { setShowSuccessModal(false); router.push("/login"); }} 
                className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E]"
              >
                Back to Login
              </Button>
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
              <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
              <p className="text-gray-400 mb-4">{errorMessage}</p>
              <Button 
                onClick={() => setShowErrorModal(false)} 
                variant="outline"
                className="w-full border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
