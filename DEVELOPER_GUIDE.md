# Hopewell ChMS - Developer Guide

## Project Structure

```
hopewell/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── giving/
│   │   ├── events/
│   │   ├── profile/
│   │   ├── notifications/
│   │   └── sermons/
│   ├── dashboard/                 # Dashboard layouts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   ├── pastor/
│   │   ├── member/
│   │   ├── treasurer/
│   │   ├── praise-worship/
│   │   └── ushering/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── theme-provider.tsx
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── queries.ts
│   ├── helpers.ts
│   ├── validations.ts
│   ├── constants.ts
│   └── types.ts
├── supabase/
│   ├── migrations/                # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   ├── seed.sql                   # Seed data
│   └── functions/                 # Edge Functions
│       ├── send-otp/
│       ├── mpesa-stk-push/
│       └── ...
├── public/                        # Static assets
├── middleware.ts                  # Next.js middleware
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start Supabase locally
supabase start

# Link to remote project
supabase link --project-ref your-project-id

# Apply database migrations
supabase db push

# Seed sample data
supabase seed apply
```

### 2. Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### 3. Adding New Features

#### Add a New Database Table

1. Create migration file:
```bash
supabase migrations new add_my_table
```

2. Edit `supabase/migrations/TIMESTAMP_add_my_table.sql`:
```sql
CREATE TABLE my_table (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view my_table" 
  ON my_table FOR SELECT 
  USING (true);
```

3. Apply migration:
```bash
supabase db push
```

#### Add a New Dashboard Page

1. Create page folder:
```bash
mkdir -p app/dashboard/admin/new-feature
```

2. Create `page.tsx`:
```tsx
"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewFeaturePage() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div>
      <h1>New Feature</h1>
      {/* Component JSX */}
    </div>
  );
}
```

#### Add API Route

1. Create route file:
```bash
touch app/api/my-endpoint/route.ts
```

2. Implement route:
```tsx
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  // Implementation
  return NextResponse.json({ data }, { status: 200 });
}
```

#### Add Edge Function

1. Create function:
```bash
supabase functions new my-function
```

2. Edit `supabase/functions/my-function/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // Function logic
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
})
```

3. Deploy:
```bash
supabase functions deploy my-function
```

## Code Patterns

### Data Fetching Pattern

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("table_name")
          .select("*");
        
        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <div>{/* Render data */}</div>;
}
```

### Form Submission Pattern

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("table_name")
        .insert({ /* data */ });

      if (error) throw error;
      // Success handling
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Error Handling Pattern

```tsx
try {
  const { data, error } = await supabase
    .from("table")
    .select("*");

  if (error) {
    // Handle specific error types
    if (error.code === "PGRST116") {
      // Not found
    } else if (error.code === "42P01") {
      // Table doesn't exist
    }
    throw error;
  }

  return data;
} catch (error) {
  console.error("Database error:", error);
  // Show user-friendly error message
}
```

## Testing

### Unit Tests

```bash
npm run test
```

Example test:
```typescript
import { formatKES } from "@/lib/helpers";

describe("formatKES", () => {
  it("formats currency correctly", () => {
    expect(formatKES(1000)).toBe("KES 1,000");
  });
});
```

### Integration Tests

Test API routes:
```typescript
describe("/api/giving/transactions", () => {
  it("creates transaction", async () => {
    const response = await fetch("/api/giving/transactions", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        givingType: "offering",
        paymentMethod: "mpesa",
      }),
    });
    expect(response.status).toBe(201);
  });
});
```

## Performance Optimization

### 1. Database Query Optimization

```ts
// ❌ Bad: N+1 queries
sermons.map(async (sermon) => {
  const speaker = await getUser(sermon.speaker_id);
})

// ✅ Good: Single query with join
const { data } = await supabase
  .from("sermons")
  .select(`
    *,
    speaker:speaker_id(*)
  `);
```

### 2. Component Optimization

```tsx
// ✅ Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// ✅ Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

### 3. Image Optimization

```tsx
// ✅ Use Next.js Image component
import Image from "next/image";

<Image
  src="/image.png"
  alt="Description"
  width={400}
  height={300}
  priority
/>
```

## Common Issues & Solutions

### Issue: "NEXTAUTH_SECRET not set"
**Solution**: Add `NEXTAUTH_SECRET` to `.env.local`

### Issue: Supabase connection fails
**Solution**: 
```bash
# Check connection
supabase status

# Reset connection
supabase link --project-ref your-project-id
```

### Issue: RLS policy prevents access
**Solution**: Check RLS policies in Supabase dashboard for the table

### Issue: TypeScript errors with Supabase types
**Solution**:
```bash
# Generate types
supabase gen types typescript --local > types/database.ts
```

## Security Best Practices

1. **Never commit secrets**
   - Use `.env.local` (gitignored)
   - Use Vercel secrets for production

2. **Use RLS policies**
   - Enable on all tables
   - Test thoroughly

3. **Validate input**
   - Use Zod for form validation
   - Validate on both client and server

4. **Use HTTPS only**
   - Enable in Vercel/production

5. **Monitor logs**
   - Check Supabase logs regularly
   - Set up error tracking (Sentry)

## Debugging

### Enable debug logging

```tsx
// In development
if (process.env.NODE_ENV === "development") {
  console.log("Debug info", data);
}
```

### Use browser DevTools

- Network tab: Check API calls
- Storage: Check localStorage/cookies
- Console: Check errors

### Check Supabase logs

```bash
supabase functions logs send-otp

# Follow logs in real-time
supabase functions logs send-otp --follow
```

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit: `git commit -am "Add new feature"`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request
5. Wait for review and approval
6. Merge to main

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## Support

For issues and questions:
- GitHub Issues: [Create issue](https://github.com/yourusername/hopewell-chms/issues)
- Email: support@hopewellchms.com
- Discord: [Join Community](https://discord.gg/hopewell)
