// Environment configuration and constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Roles
export const ROLES = {
  ADMIN: "admin",
  PASTOR: "pastor",
  MEMBER: "member",
  TREASURER: "treasurer",
  PRAISE_WORSHIP: "praise-worship",
  USHERING: "ushering",
} as const;

export const MEMBER_STATUSES = {
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
  PRAYER_MEETING: "prayer_meeting",
  BIBLE_STUDY: "bible_study",
  CONFERENCE: "conference",
  OUTREACH: "outreach",
  SOCIAL: "social",
} as const;

// UI Constants
export const PAGINATION_LIMIT = 20;
export const TOAST_DURATION = 3000;

// M-Pesa Prompt Text
export const MPESA_PROMPT_TEXT = "Enter M-Pesa PIN to complete donation";

// Kenyan Counties
export const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Calibrated",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kamba",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kochi",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Manyata",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Tana North",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

// Bible Books
export const BIBLE_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

// Music Keys
export const MUSIC_KEYS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "A#m",
  "Bm",
];

// Music Genres
export const MUSIC_GENRES = [
  "Hymn",
  "Contemporary Gospel",
  "Traditional Gospel",
  "Afrobeats Gospel",
  "Reggae Gospel",
  "Rock Gospel",
  "Soul",
  "Worship",
  "Praise",
  "Other",
];

// Prayer Request Categories
export const PRAYER_REQUEST_CATEGORIES = [
  "General",
  "Health",
  "Family",
  "Work",
  "Financial",
  "Spiritual",
  "Relationships",
  "Studies",
  "Thanksgiving",
  "Other",
];

// Group Types
export const GROUP_TYPES = [
  "Cell Group",
  "Bible Study",
  "Prayer Group",
  "Youth Group",
  "Women's Group",
  "Men's Group",
  "Volunteers",
  "Choir",
  "Team",
  "Other",
];

// Budget Categories
export const BUDGET_CATEGORIES = [
  "Salaries & Staff",
  "Operations",
  "Building Maintenance",
  "Missions & Outreach",
  "Events & Ceremonies",
  "Supplies & Equipment",
  "Utilities",
  "Insurance",
  "Communications",
  "Other",
];

// Page Limits
export const LIMITS = {
  MEMBERS_PER_PAGE: 20,
  EVENTS_PER_PAGE: 10,
  GIVING_HISTORY_PER_PAGE: 15,
  SERMONS_PER_PAGE: 10,
  PRAYER_REQUESTS_PER_PAGE: 20,
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You do not have permission to perform this action",
  NOT_FOUND: "Resource not found",
  INVALID_INPUT: "Invalid input provided",
  SERVER_ERROR: "An error occurred. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
  AUTHENTICATION_FAILED: "Authentication failed. Please log in again",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully",
  DONATION_CREATED: "Your donation has been recorded",
  EVENT_REGISTERED: "You have registered for the event",
  PRAYER_REQUEST_SUBMITTED: "Prayer request submitted successfully",
};
