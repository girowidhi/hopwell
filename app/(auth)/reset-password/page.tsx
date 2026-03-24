"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertCircle, 
  Loader, 
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Shield,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  const accessToken = searchParams.get("access_token");
  const type = searchParams.get("type");
  const email = searchParams.get("email");

  useEffect(() => {
    const passedRequirements = passwordRequirements.filter((req) => req.test(password));
    setPasswordStrength(passedRequirements.length);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-amber-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setTermsError(false);

    if (!agreedToTerms) {
      setTermsError(true);
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      if (accessToken) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      } else if (type === "recovery" && email) {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: password }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to reset password");
        }
      } else {
        throw new Error("Invalid reset link. Please request a new password reset.");
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessToken && type !== "recovery") {
    return (
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-red-400">Invalid Reset Link</CardTitle>
          <CardDescription className="text-gray-400">
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-500 mb-4">
            <p>Please request a new password reset link.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/forgot-password">
              <Button className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E]">
                Request New Reset Link
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Lock className="h-6 w-6 text-[#C9A87C]" />
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#C9A87C]" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({});
                  }}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ boxShadow: errors.password ? "0 0 0 1px #ef4444" : passwordStrength > 0 ? "0 0 0 1px #22c55e" : "none" }}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C9A87C] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {password && (
                <div className="space-y-2 animate-in slide-in-from-top-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getPasswordStrengthColor() : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength <= 1 ? "text-red-400" : passwordStrength <= 3 ? "text-amber-400" : "text-green-400"
                  }`}>
                    Password strength: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {password && (
              <div className="space-y-2 p-3 bg-[#0A0F1E]/50 rounded-lg border border-[#C9A87C]/10">
                <p className="text-xs font-medium text-gray-400">Password requirements:</p>
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div 
                      key={req.id}
                      className={`flex items-center gap-1 text-xs ${
                        req.test(password) ? "text-green-400" : "text-gray-500"
                      } transition-colors`}
                    >
                      {req.test(password) ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-600" />}
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#C9A87C]" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({});
                  }}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ boxShadow: errors.confirmPassword ? "0 0 0 1px #ef4444" : confirmPassword && password === confirmPassword ? "0 0 0 1px #22c55e" : "none" }}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C9A87C] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <CheckCircle className="h-3 w-3" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                    if (checked) setTermsError(false);
                  }}
                  className={`border-[#C9A87C]/30 ${termsError ? "border-red-500" : ""} data-[state=checked]:bg-[#C9A87C] data-[state=checked]:border-[#C9A87C]`}
                />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-tight">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#C9A87C] hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#C9A87C] hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {termsError && (
                <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  You must accept the terms and conditions
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#C9A87C]/10">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-[#C9A87C] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1525] border border-green-500/20 rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Password Reset Successful</h3>
              <p className="text-gray-400 mb-4">You can now sign in with your new password.</p>
              <Button onClick={() => { setShowSuccessModal(false); router.push("/login"); }} className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E]">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1525] border border-red-500/20 rounded-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
              <p className="text-gray-400 mb-4">{errorMessage}</p>
              <Button onClick={() => setShowErrorModal(false)} variant="outline" className="w-full border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-white">Loading...</CardTitle>
        </CardHeader>
      </Card>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
