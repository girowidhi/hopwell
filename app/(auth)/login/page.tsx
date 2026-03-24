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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertCircle, 
  Loader, 
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";

interface LoginError {
  message: string;
  status?: number;
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();

  // Generate CSRF token on mount
  useEffect(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
    localStorage.setItem("csrf_token", token);
  }, []);

  // Check for existing lockout in sessionStorage
  useEffect(() => {
    const lockoutTime = sessionStorage.getItem("loginLockoutUntil");
    if (lockoutTime) {
      const remainingTime = parseInt(lockoutTime) - Date.now();
      if (remainingTime > 0) {
        setLockoutUntil(parseInt(lockoutTime));
      } else {
        sessionStorage.removeItem("loginLockoutUntil");
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      if (lockoutUntil <= Date.now()) {
        setLockoutUntil(null);
        sessionStorage.removeItem("loginLockoutUntil");
        setFailedAttempts(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Check for verified query parameter and show success message
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast({
        title: "Email Verified!",
        description: "Your account has been verified. Please sign in to continue.",
        variant: "default",
      });
      // Remove the query parameter to prevent showing the message on refresh
      router.replace("/login");
    }
  }, [searchParams, toast, router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors({});
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setIsSocialLoading(provider);
    
    try {
      // Verify CSRF token before OAuth
      const storedToken = localStorage.getItem("csrf_token");
      if (!storedToken) {
        throw new Error("Security token expired. Please refresh the page.");
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: provider === "google" ? "email profile" : "email",
        },
      });

      if (error) {
        if (error.message.includes("Rate limit") || error.message.includes("too many")) {
          setErrorMessage("Too many login attempts. Please wait before trying again.");
          setShowErrorModal(true);
        } else {
          throw error;
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign in with " + provider);
      setShowErrorModal(true);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify CSRF token
    const storedToken = localStorage.getItem("csrf_token");
    if (!storedToken || storedToken !== csrfToken) {
      setErrorMessage("Security verification failed. Please refresh the page and try again.");
      setShowErrorModal(true);
      return;
    }

    // Check for lockout
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setErrorMessage("Account is temporarily locked. Please try again later.");
      setShowErrorModal(true);
      return;
    }

    setErrors({});

    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          
          if (newAttempts >= 5) {
            const lockoutTime = Date.now() + 5 * 60 * 1000;
            setLockoutUntil(lockoutTime);
            sessionStorage.setItem("loginLockoutUntil", lockoutTime.toString());
            setErrorMessage("Too many failed attempts. Your account is locked for 5 minutes.");
            setShowErrorModal(true);
            setIsLoading(false);
            setIsSubmitting(false);
            return;
          }

          setErrorMessage(`Invalid email or password. ${5 - newAttempts} attempts remaining.`);
          setShowErrorModal(true);
          throw new Error("Invalid credentials");
        }

        if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please verify your email address before signing in.");
          setShowErrorModal(true);
          localStorage.setItem("pendingVerificationEmail", formData.email);
          throw new Error("Email not confirmed");
        }

        throw error;
      }

      setFailedAttempts(0);
      sessionStorage.removeItem("loginLockoutUntil");
      localStorage.removeItem("pendingVerificationEmail");
      
      // Rotate CSRF token after successful login
      const newToken = crypto.randomUUID();
      setCsrfToken(newToken);
      localStorage.setItem("csrf_token", newToken);

      setShowSuccessModal(true);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      if ((error as LoginError).message !== "Invalid credentials" && 
          (error as LoginError).message !== "Email not confirmed") {
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        setShowErrorModal(true);
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const getLockoutRemainingTime = () => {
    if (!lockoutUntil) return 0;
    return Math.ceil((lockoutUntil - Date.now()) / 1000);
  };

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your Hopewell ChMS account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C9A87C]" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                style={{ 
                  boxShadow: errors.email ? "0 0 0 1px #ef4444" : "none"
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading || !!lockoutUntil}
                autoComplete="email"
              />
              {errors.email && (
                <p 
                  id="email-error" 
                  className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#C9A87C]" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.password ? "0 0 0 1px #ef4444" : "none"
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isLoading || !!lockoutUntil}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C9A87C] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p 
                  id="password-error" 
                  className="text-sm text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading || !!lockoutUntil}
                  className="border-[#C9A87C]/30 data-[state=checked]:bg-[#C9A87C] data-[state=checked]:border-[#C9A87C]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-400 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A87C]/20" 
              disabled={isLoading || isSubmitting || !!lockoutUntil}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : lockoutUntil ? (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Locked ({getLockoutRemainingTime()}s)
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Lockout Notice */}
          {lockoutUntil && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-1">
              <div className="flex items-center gap-2 text-sm text-red-400">
                <Shield className="h-4 w-4" />
                <span>
                  Too many failed attempts. Try again in {getLockoutRemainingTime()} seconds.
                </span>
              </div>
            </div>
          )}

          {/* Social Login at Bottom */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#C9A87C]/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0F1525] px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={!!isSocialLoading || !!lockoutUntil}
                className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white hover:bg-[#C9A87C]/10 hover:border-[#C9A87C]/40 hover:text-[#C9A87C] transition-all duration-200"
              >
                {isSocialLoading === "google" ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#C9A87C" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#C9A87C" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#C9A87C" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#C9A87C" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("apple")}
                disabled={!!isSocialLoading || !!lockoutUntil}
                className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white hover:bg-[#C9A87C]/10 hover:border-[#C9A87C]/40 hover:text-[#C9A87C] transition-all duration-200"
              >
                {isSocialLoading === "apple" ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                )}
                Apple
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 text-center text-sm pt-4 border-t border-[#C9A87C]/10">
            <div>
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#C9A87C] hover:text-[#B8956A] font-medium transition-colors">
                Sign up
              </Link>
            </div>
            <div>
              <Link href="/forgot-password" className="text-gray-400 hover:text-[#C9A87C] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#0F1525] border-[#C9A87C]/20 animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              Welcome Back!
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center pt-2">
              You have successfully signed in
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A87C]"></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md bg-[#0F1525] border-red-500/20 animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              Sign In Failed
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 text-center">{errorMessage}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={() => setShowErrorModal(false)} 
              variant="outline"
              className="w-full sm:w-auto border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10"
            >
              Try Again
            </Button>
            {errorMessage.includes("verify") && (
              <Link href="/verify" className="w-full sm:w-auto">
                <Button className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E]">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Email
                </Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-white">Loading...</CardTitle>
        </CardHeader>
      </Card>
    }>
      <LoginContent />
    </Suspense>
  );
}
