// Email template types and utilities for Hopewell ChMS
// These templates match the auth page styling (dark theme with gold #C9A87C accents)

export type EmailTemplateType = 
  | "email_verify" 
  | "password_reset" 
  | "login_verification"
  | "welcome"
  | "account_update"
  | "event_reminder";

interface EmailTemplateData {
  subject: string;
  title: string;
  description: string;
  ctaText?: string;
  footerText: string;
  templateType: "otp" | "notification";
}

// Template configurations for each email type
export const EMAIL_TEMPLATES: Record<EmailTemplateType, EmailTemplateData> = {
  email_verify: {
    subject: "Verify Your Email - Hopewell ChMS",
    title: "Verify Your Email",
    description: "Thank you for signing up with Hopewell ChMS. Please use the verification code below to confirm your email address.",
    ctaText: "Verify Email",
    footerText: "If you didn't create an account with Hopewell ChMS, please ignore this email.",
    templateType: "otp",
  },
  password_reset: {
    subject: "Reset Your Password - Hopewell ChMS",
    title: "Reset Your Password",
    description: "We received a request to reset your Hopewell ChMS password. Use the verification code below to proceed.",
    ctaText: "Reset Password",
    footerText: "If you didn't request a password reset, please ignore this email or contact support.",
    templateType: "otp",
  },
  login_verification: {
    subject: "Verify Your Login - Hopewell ChMS",
    title: "Verify Your Login",
    description: "We noticed a sign-in attempt to your Hopewell ChMS account. Use the verification code below to complete the process.",
    ctaText: "Verify Login",
    footerText: "If this wasn't you, please secure your account immediately.",
    templateType: "otp",
  },
  welcome: {
    subject: "Welcome to Hopewell ChMS",
    title: "Welcome to Hopewell",
    description: "Your account has been created successfully. We're excited to have you as part of our church community.",
    ctaText: "Explore Dashboard",
    footerText: "Need help? Contact us anytime.",
    templateType: "notification",
  },
  account_update: {
    subject: "Your Account Has Been Updated - Hopewell ChMS",
    title: "Account Updated",
    description: "Your Hopewell ChMS account details have been updated successfully.",
    footerText: "If you didn't make this change, please contact support immediately.",
    templateType: "notification",
  },
  event_reminder: {
    subject: "Upcoming Event - Hopewell ChMS",
    title: "Event Reminder",
    description: "You have an upcoming event. Here are the details:",
    footerText: "We look forward to seeing you!",
    templateType: "notification",
  },
};

// Generate OTP email HTML (for use in API routes that send directly)
export function generateOTPEmailHTML(
  type: EmailTemplateType,
  otp: string,
  firstName?: string
): string {
  const template = EMAIL_TEMPLATES[type];
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0A0F1E; padding: 20px; margin: 0;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #0F1525; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); border: 1px solid rgba(201, 168, 124, 0.2);">
      <!-- Logo and Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(201, 168, 124, 0.1), rgba(201, 168, 124, 0.05)); border-radius: 12px; border: 1px solid rgba(201, 168, 124, 0.2);">
          <h1 style="color: #C9A87C; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">HOPEWELL</h1>
          <p style="color: #C9A87C/80; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Church Management System</p>
        </div>
      </div>
      
      <!-- Decorative Cross -->
      <div style="text-align: center; margin-bottom: 24px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A87C" stroke-width="1.5" stroke-linecap="round">
          <path d="M12 2v20M2 12h20" stroke-linecap="round" />
        </svg>
      </div>
      
      <!-- Greeting -->
      ${firstName ? `<p style="color: #9CA3AF; font-size: 15px; margin: 0 0 16px 0; text-align: center;">Hello, ${firstName}!</p>` : ''}
      
      <!-- Title -->
      <h2 style="color: #FFFFFF; margin: 0 0 16px 0; font-size: 24px; text-align: center; font-weight: 600;">${template.title}</h2>
      
      <!-- Description -->
      <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; text-align: center;">
        ${template.description}
      </p>
      
      <!-- OTP Code Box -->
      <div style="background: linear-gradient(135deg, #0A0F1E 0%, #151D2E 100%); border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px; border: 1px solid rgba(201, 168, 124, 0.3);">
        <p style="color: #C9A87C; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Your Verification Code</p>
        <span style="color: #FFFFFF; font-size: 36px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</span>
      </div>
      
      <!-- Expiry Warning -->
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="color: #F59E0B; font-size: 13px; margin: 0; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          This code will expire in <strong>3 minutes</strong>
        </p>
      </div>
      
      <!-- Help Text -->
      <div style="background-color: rgba(201, 168, 124, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #6B7280; font-size: 12px; margin: 0; text-align: center; line-height: 1.5;">
          Having trouble? The verification code can be entered on the login page.<br>
          If you didn't request this, please ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid rgba(201, 168, 124, 0.1); padding-top: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 11px; margin: 0;">
          ${template.footerText}
        </p>
        <p style="color: #374151; font-size: 11px; margin: 8px 0 0 0;">
          © ${new Date().getFullYear()} Hopewell Church. All rights reserved.
        </p>
      </div>
    </div>
    
    <!-- Fallback for email clients that don't support styled divs -->
    <div style="display: none; font-size: 0; line-height: 0;">
      Verification Code: ${otp}
    </div>
  </body>
</html>
`;
}

// Generate notification email HTML
export function generateNotificationEmailHTML(
  type: EmailTemplateType,
  content?: {
    firstName?: string;
    eventTitle?: string;
    eventDate?: string;
    eventLocation?: string;
    additionalInfo?: string;
  }
): string {
  const template = EMAIL_TEMPLATES[type];
  
  // Custom content for event reminder
  const eventContent = type === "event_reminder" ? `
    <div style="background-color: rgba(201, 168, 124, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid rgba(201, 168, 124, 0.2);">
      <h3 style="color: #C9A87C; margin: 0 0 16px 0; font-size: 18px;">${content?.eventTitle || "Church Event"}</h3>
      <div style="color: #9CA3AF; font-size: 14px; line-height: 1.8;">
        <p style="margin: 0 0 8px 0;">
          <strong style="color: #C9A87C;">📅 Date:</strong> ${content?.eventDate || "TBD"}
        </p>
        <p style="margin: 0 0 8px 0;">
          <strong style="color: #C9A87C;">📍 Location:</strong> ${content?.eventLocation || "TBD"}
        </p>
        ${content?.additionalInfo ? `<p style="margin: 0;">${content.additionalInfo}</p>` : ""}
      </div>
    </div>
  ` : "";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0A0F1E; padding: 20px; margin: 0;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #0F1525; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); border: 1px solid rgba(201, 168, 124, 0.2);">
      <!-- Logo and Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(201, 168, 124, 0.1), rgba(201, 168, 124, 0.05)); border-radius: 12px; border: 1px solid rgba(201, 168, 124, 0.2);">
          <h1 style="color: #C9A87C; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">HOPEWELL</h1>
          <p style="color: #C9A87C/80; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Church Management System</p>
        </div>
      </div>
      
      <!-- Decorative Cross -->
      <div style="text-align: center; margin-bottom: 24px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A87C" stroke-width="1.5" stroke-linecap="round">
          <path d="M12 2v20M2 12h20" stroke-linecap="round" />
        </svg>
      </div>
      
      <!-- Greeting -->
      ${content?.firstName ? `<p style="color: #9CA3AF; font-size: 15px; margin: 0 0 16px 0; text-align: center;">Hello, ${content.firstName}!</p>` : ''}
      
      <!-- Title -->
      <h2 style="color: #FFFFFF; margin: 0 0 16px 0; font-size: 24px; text-align: center; font-weight: 600;">${template.title}</h2>
      
      <!-- Description -->
      <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
        ${template.description}
      </p>
      
      <!-- Event-specific content -->
      ${eventContent}
      
      <!-- CTA Button -->
      ${template.ctaText ? `
      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://hopewellchms.com"}/dashboard" style="display: inline-block; background-color: #C9A87C; color: #0A0F1E; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          ${template.ctaText}
        </a>
      </div>
      ` : ''}
      
      <!-- Help Text -->
      <div style="background-color: rgba(201, 168, 124, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #6B7280; font-size: 12px; margin: 0; text-align: center; line-height: 1.5;">
          ${template.footerText}
        </p>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid rgba(201, 168, 124, 0.1); padding-top: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} Hopewell Church. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;
}

// Generate plain text version for accessibility
export function generatePlainText(
  type: EmailTemplateType,
  otp?: string,
  content?: Record<string, string>
): string {
  const template = EMAIL_TEMPLATES[type];
  
  let text = `
HOPEWELL CHMS - ${template.title.toUpperCase()}
=============================================

${template.description}
${otp ? `\n\nYOUR VERIFICATION CODE: ${otp}\n\nThis code will expire in 3 minutes.` : ''}
${content?.eventTitle ? `\n\nEvent: ${content.eventTitle}\nDate: ${content.eventDate || "TBD"}\nLocation: ${content.eventLocation || "TBD"}` : ''}

${template.footerText}

© ${new Date().getFullYear()} Hopewell Church. All rights reserved.
  `.trim();
  
  return text;
}

// Get email template configuration
export function getEmailTemplate(type: EmailTemplateType): EmailTemplateData {
  return EMAIL_TEMPLATES[type];
}