export const APP_NAME = "Hopewell ChMS";
export const APP_DESCRIPTION = "A modern Church Management System for Kenya";

export const ROLES = {
  ADMIN: "admin",
  PASTOR: "pastor",
  MEMBER: "member",
  TREASURER: "treasurer",
  PRAISE_WORSHIP: "praise-worship",
  USHERING: "ushering",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  pastor: "Pastor",
  member: "Member",
  treasurer: "Treasurer",
  "praise-worship": "Praise & Worship",
  ushering: "Ushering & Hospitality",
};

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  pastor: "/dashboard/pastor",
  member: "/dashboard/member",
  treasurer: "/dashboard/treasurer",
  "praise-worship": "/dashboard/praise-worship",
  ushering: "/dashboard/ushering",
};

export const MEMBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  SUSPENDED: "suspended",
} as const;

export const GIVING_TYPES = {
  TITHE: "tithe",
  OFFERING: "offering",
  SPECIAL: "special",
  BUILDING_FUND: "building_fund",
  MISSIONS: "missions",
  BENEVOLENCE: "benevolence",
} as const;

export const PAYMENT_METHODS = {
  MPESA: "mpesa",
  STRIPE: "stripe",
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
} as const;

export const EVENT_TYPES = {
  SERVICE: "service",
  BIBLE_STUDY: "bible_study",
  PRAYER_MEETING: "prayer_meeting",
  YOUTH: "youth",
  CONFERENCE: "conference",
  OUTREACH: "outreach",
  OTHER: "other",
} as const;

export const PRAYER_STATUS = {
  OPEN: "open",
  ANSWERED: "answered",
  CLOSED: "closed",
} as const;

export const PRAYER_CATEGORIES = {
  HEALTH: "health",
  FAMILY: "family",
  FINANCIAL: "financial",
  SPIRITUAL: "spiritual",
  CAREER: "career",
  RELATIONSHIPS: "relationships",
  OTHER: "other",
} as const;

export const NOTIFICATION_TYPES = {
  SMS: "sms",
  EMAIL: "email",
  PUSH: "push",
  IN_APP: "in_app",
} as const;

export const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
] as const;
