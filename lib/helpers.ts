// Additional utility functions for common operations
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Format currency in Kenyan Shillings
export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date in Kenyan format
export function formatDateKE(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// Format time
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

// Generate initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Get role display name
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    admin: "Administrator",
    pastor: "Pastoral Leader",
    member: "Member",
    treasurer: "Treasurer",
    "praise-worship": "Praise & Worship",
    ushering: "Ushering Team",
  };
  return roleMap[role] || role;
}

// Get role color
export function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    pastor: "bg-blue-100 text-blue-800",
    member: "bg-green-100 text-green-800",
    treasurer: "bg-purple-100 text-purple-800",
    "praise-worship": "bg-pink-100 text-pink-800",
    ushering: "bg-yellow-100 text-yellow-800",
  };
  return colorMap[role] || "bg-gray-100 text-gray-800";
}

// Get status badge color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-orange-100 text-orange-800",
  };
  return statusMap[status] || "bg-gray-100 text-gray-800";
}

// Truncate long text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Generate random color for avatars
export function getRandomColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Calculate percentage
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

// Check if user has permission
export async function hasPermission(
  userId: string,
  role: string,
  action: string
): Promise<boolean> {
  // This would typically check against a permissions table
  // For now, returning true for development
  return true;
}

// Send toast notification
export function showToast(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
): void {
  // This would typically use the toast hook from shadcn/ui
  console.log(`${type.toUpperCase()}: ${message}`);
}

// Validate phone number format
export function validatePhoneNumber(phone: string): boolean {
  // Kenyan phone format: +254XXXXXXXXX or 0XXXXXXXXX
  const phoneRegex = /^(\+254|0)[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// Convert phone number to international format
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  if (phone.startsWith("+254")) return phone;
  if (phone.startsWith("0")) return "+254" + phone.substring(1);
  return "+254" + phone;
}

// Check if email is valid
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Parse giving transaction type
export function parseGivingType(type: string): string {
  const typeMap: Record<string, string> = {
    tithe: "Tithe",
    offering: "Offering",
    special: "Special Offering",
    building_fund: "Building Fund",
    missions: "Missions",
    benevolence: "Benevolence",
  };
  return typeMap[type] || type;
}

// Get giving type icon
export function getGivingTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    tithe: "💰",
    offering: "🙏",
    special: "⭐",
    building_fund: "🏗️",
    missions: "🌍",
    benevolence: "❤️",
  };
  return iconMap[type] || "💵";
}

// Calculate days until date
export function daysUntil(date: string | Date): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Check if date is in the past
export function isPastDate(date: string | Date): boolean {
  return new Date(date) < new Date();
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

// Get day of week
export function getDayOfWeek(date: string | Date): string {
  const d = new Date(date);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[d.getDay()];
}

// Generate QR code data URL (would typically use qrcode library)
export function generateQRCodeURL(data: string): string {
  // This would use a library like qrcode.react or qr-code-generator
  // For now, return a placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='white'/%3E%3C/svg%3E`;
}
