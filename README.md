# Hopewell ChMS - Church Management System for Kenya

A modern, secure, mobile-responsive Church Management System built for Kenyan churches using Next.js 15, Supabase, and various integrations.

## Features

### Admin Dashboard
- Total members overview
- Weekly attendance tracking
- Offering management
- Event management
- System health monitoring
- User management & role assignment
- Global settings
- Multi-campus support
- Audit logs
- Backup management
- SMS/Email credit tracking
- Theme & branding customization
- AI usage analytics

### Pastor Dashboard
- Sermon management (upload, series, scheduling)
- AI-powered sermon assistant
- Member insights & analytics
- Pastoral care notes
- Counseling tracking
- Bible reading plans
- Sermon feedback
- Bulletin creation
- Prayer analytics
- Upcoming events
- Messaging system
- Prayer wall
- Live stream control

### Member Dashboard
- Profile management
- Giving history & recurring donations
- Giving statements
- Tithing goals
- Event registration
- Group participation & forum
- Sermon library
- Prayer requests submission
- Notifications
- Volunteer schedule
- Member directory
- Spiritual growth tracker
- Personal prayer journal
- Family management

### Treasurer Dashboard
- Giving overview with charts
- Financial projections
- Offline giving entry
- Donor management
- Pledge tracking
- Tax receipt generation
- Bank reconciliation
- Budget alerts
- Expense management
- M-Pesa integration
- Financial reports

### Praise & Worship Dashboard
- Song library management
- Setlist planning & creation
- Setlist sharing
- Media library
- Team scheduling
- Rehearsal tracking
- Equipment inventory
- Service order management
- Lyrics display

### Ushering & Hospitality Dashboard
- QR code check-in
- Seating layout & floor plan editor
- Visitor management
- Hospitality task assignment
- Parking management
- First-aid inventory
- Incident reporting
- Volunteer rotation
- AI-powered guest follow-up

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components

### Backend & Database
- **Supabase** (PostgreSQL)
- **Supabase Auth** (Email verification via OTP)
- **Supabase Storage** (File uploads)
- **Supabase Realtime** (Real-time updates)
- **Supabase Edge Functions** (Server-side logic)

### AI & ML
- **OpenAI API** (GPT-4 for sermon assistant, member insights, follow-up emails)
- **pgvector** (Semantic search with sermon transcripts)

### Payments & Transactions
- **Lipa na M-Pesa (STK Push)** - Kenyan mobile payment
- **Stripe** - Credit card payments

### Communications
- **Twilio** - SMS messaging
- **Resend** - Email service

### Live Streaming
- **Mux** - Video streaming and hosting

### Error Monitoring (Optional)
- **Sentry** - Error tracking

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Resend
RESEND_API_KEY=your-resend-api-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# M-Pesa
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=your-mpesa-shortcode

# Mux
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (https://supabase.com)
- OpenAI API key
- Twilio account
- Resend account
- M-Pesa Daraja API credentials (for production)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hopewell-chms.git
cd hopewell-chms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

4. **Initialize Supabase**
```bash
npm install -g supabase
supabase init
supabase link --project-ref your-project-ref
supabase db pull  # Pull existing schema
supabase migrations up  # Push migrations
```

5. **Create initial user roles and default data**
```bash
supabase db seed  # Run seed data
```

6. **Start the development server**
```bash
npm run dev
```

Visit http://localhost:3000 to access the application.

## Project Structure

```
hopewell-chms/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── pastor/
│   │   ├── member/
│   │   ├── treasurer/
│   │   ├── praise-worship/
│   │   └── ushering/
│   ├── page.tsx (landing page)
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── DashboardLayout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── constants.ts
│   ├── types.ts
│   └── utils.ts
├── supabase/
│   ├── functions/
│   │   ├── send-otp/
│   │   ├── mpesa-stk-push/
│   │   ├── mpesa-callback/
│   │   ├── ai-sermon-assistant/
│   │   ├── ai-member-insights/
│   │   ├── bulk-sms/
│   │   └── bulk-email/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_rls_policies.sql
├── public/
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Database Schema

The system includes the following main tables:

- **members** - User profiles with membership details
- **user_roles** - Role-based access control (admin, pastor, member, treasurer, praise-worship, ushering)
- **events** - Church events and services
- **event_registrations** - Event attendance tracking
- **sermons** - Sermon records with video/audio
- **sermon_series** - Sermon series management
- **giving_transactions** - Donation and contribution tracking
- **expenses** - Church expense records
- **groups** - Small groups and ministries
- **group_members** - Group membership
- **prayer_requests** - Prayer request board
- **songs** - Song library for worship
- **setlists** - Worship service setlists
- **attendance** - Service attendance tracking
- **volunteer_shifts** - Volunteer scheduling
- **notifications** - User notifications
- **mpesa_transactions** - M-Pesa transaction records
- **budgets** - Church budgets
- **pledges** - Pledged giving
- **audit_logs** - System audit trail
- **visitors** - Visitor management

## Authentication

The system uses Supabase Auth with phone + email OTP verification:

1. User signs up with email, password, phone, and basic info
2. System sends OTP via SMS (Twilio) and Email (Resend)
3. User verifies OTP on verification page
4. Upon verification, member profile is created in `public.members` table
5. User role is assigned (default: member)
6. User is redirected to their role-specific dashboard

## API Routes

- `POST /api/auth/verify-otp` - Verify OTP and create member profile
- `GET /api/auth/user` - Get current user with role
- `POST /api/auth/logout` - Logout user

## Edge Functions

### send-otp
Sends OTP via SMS and email for user verification.

**Deploy:**
```bash
supabase functions deploy send-otp
```

### mpesa-stk-push
Initiates M-Pesa payment prompt for donations.

**Deploy:**
```bash
supabase functions deploy mpesa-stk-push
```

### mpesa-callback
Handles M-Pesa payment callbacks.

**Deploy:**
```bash
supabase functions deploy mpesa-callback
```

### ai-sermon-assistant
Generates sermon outlines using OpenAI.

**Deploy:**
```bash
supabase functions deploy ai-sermon-assistant
```

### bulk-sms
Sends bulk SMS messages via Twilio.

**Deploy:**
```bash
supabase functions deploy bulk-sms
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

### Manual Deployment

```bash
npm run build
npm start
```

## Row-Level Security (RLS)

All tables have RLS policies enabled:

- Members can only see their own data and other active members
- Treasurers can see financial data
- Admins have full access
- Prayer requests with privacy flag only visible to requester
- Audit logs only visible to admins

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch from `develop`
2. Submit a pull request with detailed description
3. Ensure all tests pass
4. Request code review

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support:
- Email: support@hopewellchms.com
- Documentation: https://docs.hopewellchms.com
- Issues: Create an issue on GitHub

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting & analytics
- [ ] Multi-language support (Swahili, English)
- [ ] Integration with accounting software (Sage)
- [ ] Barcode check-in (instead of QR only)
- [ ] In-app calling
- [ ] AI-powered member suggestions
- [ ] Advanced scheduling for volunteers
- [ ] Customizable email templates

## Security

- All data encrypted at rest
- TLS encryption in transit
- Regular security audits
- Two-factor authentication for admin accounts
- Comprehensive audit logging
- GDPR compliant

## Performance

- Optimized database queries with indexes
- Caching with Next.js
- CDN for static assets
- Image optimization
- Lazy loading components

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)

---

Made with ❤️ for the Kenyan church community
