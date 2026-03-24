// Form validation schemas using Zod
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const memberProfileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  occuption: z.string().optional(),
});

export const givingTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  givingType: z.enum([
    "tithe",
    "offering",
    "special",
    "building_fund",
    "missions",
    "benevolence",
  ]),
  paymentMethod: z.enum(["mpesa", "stripe", "cash", "bank_transfer"]),
});

export const prayerRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  eventType: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().optional(),
  maxAttendees: z.number().positive().optional(),
  registrationRequired: z.boolean().default(false),
});

export const sermonSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  sermonDate: z.string(),
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const budgetSchema = z.object({
  name: z.string().min(3, "Budget name is required"),
  category: z.string(),
  allocatedAmount: z.number().positive("Amount must be positive"),
  fiscalYear: z.number().min(2020).max(2099),
});

// Type exports for use in components
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type MemberProfileFormData = z.infer<typeof memberProfileSchema>;
export type GivingTransactionFormData = z.infer<typeof givingTransactionSchema>;
export type PrayerRequestFormData = z.infer<typeof prayerRequestSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type SermonFormData = z.infer<typeof sermonSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
