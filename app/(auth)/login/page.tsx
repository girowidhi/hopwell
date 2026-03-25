"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  Shield,
  Clock
} from "lucide-react";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
  attemptWindowMs: 15 * 60 * 1000, // 15 minutes
};

interface RateLimitState {
  attempts: number;
  locked: boolean;
  lockoutEndTime: number | null;
  lastAttemptTime: number;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    attempts: 0,
    locked: false,
    lockoutEndTime: null,
    lastAttemptTime: 0,
  });
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  // Generate CSRF token on mount and check rate limit
  useEffect(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
    localStorage.setItem("csrf_token", token);

    // Check rate limit from localStorage
    const storedRateLimit = localStorage.getItem("login_rate_limit");
    if (storedRateLimit) {
      const parsed = JSON.parse(storedRateLimit);
      const now = Date.now();
      
      // Check if lockout has expired
      if (parsed.locked && parsed.lockoutEndTime && now > parsed.lockoutEndTime) {
        setRateLimit({
          attempts: 0,
          locked: false,
          lockoutEndTime: null,
          lastAttemptTime: 0,
        });
        localStorage.removeItem("login_rate_limit");
      } else {
        setRateLimit(parsed);
      }
    }

    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Redirect to dashboard based on role
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  // Update localStorage when rate limit changes
  useEffect(() => {
    if (rateLimit.attempts > 0) {
      localStorage.setItem("login_rate_limit", JSON.stringify(rateLimit));
    }
  }, [rateLimit]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailError = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email address";
    return null;
  };

  const getPasswordError = (password: string): string | null => {
    if (!password) return "Password is required";
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setEmailTouched(true);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordTouched(true);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    // Check rate limit before proceeding
    if (rateLimit.locked) {
      setErrorMessage("Too many failed attempts. Please wait before trying again.");
      setShowErrorModal(true);
      return;
    }

    setIsSocialLoading(provider);
    
    try {
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
        throw error;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : `Failed to sign in with ${provider}`);
      setShowErrorModal(true);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const updateRateLimit = (success: boolean) => {
    const now = Date.now();
    
    if (success) {
      // Reset rate limit on successful login
      setRateLimit({
        attempts: 0,
        locked: false,
        lockoutEndTime: null,
        lastAttemptTime: 0,
      });
      localStorage.removeItem("login_rate_limit");
    } else {
      const newAttempts = rateLimit.attempts + 1;
      const isLocked = newAttempts >= RATE_LIMIT_CONFIG.maxAttempts;
      
      setRateLimit({
        attempts: newAttempts,
        locked: isLocked,
        lockoutEndTime: isLocked ? now + RATE_LIMIT_CONFIG.lockoutDurationMs : null,
        lastAttemptTime: now,
      });
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

    // Check rate limit before processing
    if (rateLimit.locked && rateLimit.lockoutEndTime) {
      const remainingTime = Math.ceil((rateLimit.lockoutEndTime - Date.now()) / 1000 / 60);
      setErrorMessage(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
      setShowErrorModal(true);
      return;
    }

    setErrors({});

    const newErrors: Record<string, string> = {};
    
    const emailError = getEmailError(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const passwordError = getPasswordError(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (error) {
        updateRateLimit(false);
        
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please check your credentials and try again.");
          setShowErrorModal(true);
          throw new Error("Invalid credentials");
        }
        
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please verify your email address before signing in.");
          setShowErrorModal(true);
          throw new Error("Email not confirmed");
        }

        if (error.message.includes("rate limit") || error.message.includes("too many requests")) {
          setErrorMessage("Too many login attempts. Please wait a moment and try again.");
          setShowErrorModal(true);
          throw new Error("Rate limited");
        }

        setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
        setShowErrorModal(true);
        throw error;
      }

      // Update rate limit on success
      updateRateLimit(true);

      // Get user role from public.users table
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role, status")
          .eq("auth_user_id", data.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user role:", userError);
        }

        // Store user info in localStorage
        localStorage.setItem("user_role", userData?.role || "member");
        localStorage.setItem("user_status", userData?.status || "active");
        
        // Set session info
        localStorage.setItem("session_expires_at", (Date.now() + 3600000).toString()); // 1 hour
      }

      // Show success message
      setSuccessMessage("Login successful! Redirecting to dashboard...");
      setShowSuccessModal(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error) {
      if ((error as Error).message !== "Invalid credentials" && 
          (error as Error).message !== "Email not confirmed" &&
          (error as Error).message !== "Rate limited") {
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        if (!showErrorModal) {
          setShowErrorModal(true);
        }
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  // Get remaining lockout time
  const getLockoutRemainingTime = (): string => {
    if (!rateLimit.lockoutEndTime) return "";
    const remaining = Math.max(0, rateLimit.lockoutEndTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F1E] via-[#0F1525] to-[#05070F] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C9A87C]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C9A87C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-[#C9A87C]" />
          <p className="text-gray-400 text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">Sign in to access your Hopewell ChMS account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                style={{ 
                  boxShadow: errors.email ? "0 0 0 1px #ef4444" : "none"
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
                disabled={isLoading || rateLimit.locked}
                autoComplete="email"
              />
              {emailTouched && !errors.email && formData.email && (
                validateEmail(formData.email) && (
                  <p className="text-xs text-green-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <CheckCircle className="h-3 w-3" />
                    Valid email
                  </p>
                )
              )}
              {errors.email && (
                <p 
                  id="email-error" 
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
              <p id="email-hint" className="text-xs text-gray-500">
                Enter the email address associated with your account
              </p>
            </div>

            {/* Password Field */}
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
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordTouched(true)}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.password ? "0 0 0 1px #ef4444" : "none"
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isLoading || rateLimit.locked}
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
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#C9A87C] hover:text-[#B8956A] transition-colors flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                Forgot password?
              </button>
            </div>

            {/* Rate Limit Warning */}
            {rateLimit.locked && rateLimit.lockoutEndTime && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-red-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Account temporarily locked</span>
                </div>
                <p className="text-xs text-red-300/70 mt-1">
                  Too many failed attempts. Try again in {getLockoutRemainingTime()}
                </p>
              </div>
            )}

            {/* Attempts Remaining Warning */}
            {!rateLimit.locked && rateLimit.attempts > 0 && rateLimit.attempts < RATE_LIMIT_CONFIG.maxAttempts && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{RATE_LIMIT_CONFIG.maxAttempts - rateLimit.attempts} attempts remaining</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A87C]/20"
              disabled={isLoading || isSubmitting || rateLimit.locked}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Social Login */}
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
                disabled={!!isSocialLoading || rateLimit.locked}
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
                disabled={!!isSocialLoading || rateLimit.locked}
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

          {/* Navigation Link */}
          <div className="text-center text-sm pt-4 border-t border-[#C9A87C]/10">
            <span className="text-gray-400">Don't have an account? </span>
            <Link href="/signup" className="text-[#C9A87C] hover:text-[#B8956A] font-medium transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

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
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowErrorModal(false)} 
              variant="outline"
              className="w-full sm:w-auto border-[#C9A87C]/30 text-white hover:bg-[#C9A87C]/10"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#0F1525] border-green-500/20 animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              Success
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 text-center">{successMessage}</p>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-[#C9A87C]">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Redirecting...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}