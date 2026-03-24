// In-memory OTP store for development
// Note: This won't work in production serverless - use Redis or database in production

export interface OTPEntry {
  otp: string;
  expiresAt: string;
  verified: boolean;
  email: string;
  createdAt: number;
  attempts?: number;
}

// Store OTPs in memory
export const otpStore = new Map<string, OTPEntry>();

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of otpStore.entries()) {
    if (new Date(entry.expiresAt).getTime() < now || entry.verified) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getExpiryTime(minutes: number = 10): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toISOString();
}
