"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
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
  Users,
  Phone,
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

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // Generate CSRF token on mount
  useEffect(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
    localStorage.setItem("csrf_token", token);
  }, []);

  // Calculate password strength
  useEffect(() => {
    const passedRequirements = passwordRequirements.filter((req) => req.test(formData.password));
    setPasswordStrength(passedRequirements.length);
  }, [formData.password]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return undefined;
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
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
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign in with " + provider);
      setShowErrorModal(true);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    setErrors({});

    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage("An account with this email already exists.");
          setShowErrorModal(true);
          throw new Error("User already exists");
        }
        if (error.message.includes("rate limit")) {
          setErrorMessage("Too many signup attempts. Please wait before trying again.");
          setShowErrorModal(true);
          throw new Error("Rate limited");
        }
        throw error;
      }

      // Store user info in localStorage (normalize email to lowercase)
      localStorage.setItem("pendingSignup", JSON.stringify({
        userId: data.user?.id,
        email: formData.email.toLowerCase().trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      }));

      // Now send the custom OTP via API route
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          userId: data.user?.id,
          otpType: "email_verify",
        }),
      });

      const otpResult = await otpResponse.json();

      if (!otpResponse.ok) {
        console.error("Failed to send OTP:", otpResult);
        // Continue anyway - the user can request a new code if needed
      }

      // Redirect to verification page
      router.push("/verify");
    } catch (error) {
      if ((error as Error).message !== "User already exists" && 
          (error as Error).message !== "Rate limited") {
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
        setShowErrorModal(true);
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <Card className="bg-[#0F1525]/80 backdrop-blur-sm border-[#C9A87C]/20 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-400">Sign up to get started with Hopewell ChMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#C9A87C]" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.firstName ? "0 0 0 1px #ef4444" : "none"
                  }}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  disabled={isLoading}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <p 
                    id="firstName-error" 
                    className="text-sm text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.lastName ? "0 0 0 1px #ef4444" : "none"
                  }}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  disabled={isLoading}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <p 
                    id="lastName-error" 
                    className="text-sm text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          
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
                disabled={isLoading}
                autoComplete="email"
              />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C9A87C]" />
                Phone Number
              </Label>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                error={!!errors.phone}
                disabled={isLoading}
                autoComplete="tel"
              />
              {errors.phone && (
                <p 
                  id="phone-error" 
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.password ? "0 0 0 1px #ef4444" : "none"
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-requirements"}
                  disabled={isLoading}
                  autoComplete="new-password"
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
              
              {formData.password && (
                <div className="space-y-2 animate-in slide-in-from-top-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength 
                            ? getPasswordStrengthColor() 
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength <= 1 
                      ? "text-red-400" 
                      : passwordStrength <= 3 
                        ? "text-amber-400" 
                        : "text-green-400"
                  }`}>
                    Password strength: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
              
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

            {formData.password && (
              <div 
                id="password-requirements"
                className="space-y-2 p-3 bg-[#0A0F1E]/50 rounded-lg border border-[#C9A87C]/10"
              >
                <p className="text-xs font-medium text-gray-400">Password requirements:</p>
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req) => (
                    <div 
                      key={req.id}
                      className={`flex items-center gap-1 text-xs ${
                        req.test(formData.password) ? "text-green-400" : "text-gray-500"
                      } transition-colors`}
                    >
                      {req.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-600" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#C9A87C]" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 pr-10 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200"
                  style={{ 
                    boxShadow: errors.confirmPassword ? "0 0 0 1px #ef4444" : formData.confirmPassword && formData.password === formData.confirmPassword ? "0 0 0 1px #22c55e" : "none"
                  }}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C9A87C] transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <CheckCircle className="h-3 w-3" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p 
                  id="confirm-password-error" 
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                    if (checked && errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
                  className="border-[#C9A87C]/30 data-[state=checked]:bg-[#C9A87C] data-[state=checked]:border-[#C9A87C] mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-400 cursor-pointer leading-tight"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#C9A87C] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#C9A87C] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={agreedToMarketing}
                  onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                  className="border-[#C9A87C]/30 data-[state=checked]:bg-[#C9A87C] data-[state=checked]:border-[#C9A87C] mt-1"
                />
                <label
                  htmlFor="marketing"
                  className="text-sm text-gray-400 cursor-pointer leading-tight"
                >
                  Send me updates about Hopewell ChMS
                </label>
              </div>

              {errors.terms && (
                <p className="text-sm text-red-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#C9A87C] hover:bg-[#B8956A] text-[#0A0F1E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A87C]/20" 
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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
                disabled={!!isSocialLoading}
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
                disabled={!!isSocialLoading}
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
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-[#C9A87C] hover:text-[#B8956A] font-medium transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Log in
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
              Sign Up Failed
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
    </>
  );
}
