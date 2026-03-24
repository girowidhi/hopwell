# Comprehensive Test Suite Location Guide

## Unit Tests
- Location: `__tests__/unit/`
- Run: `npm run test:unit`
- Files: 
  - `lib/helpers.test.ts` - Helper function tests
  - `lib/validations.test.ts` - Form validation tests
  - `utils/formatting.test.ts` - Formatting utilities

## Integration Tests
- Location: `__tests__/integration/`
- Run: `npm run test:integration`
- Files:
  - `api/auth.test.ts` - Authentication endpoints
  - `api/giving.test.ts` - Donation tracking
  - `api/events.test.ts` - Event management

## E2E Tests
- Location: `__tests__/e2e/`
- Run: `npm run test:e2e`
- Framework: Playwright
- Files:
  - `auth.spec.ts` - Login/signup flow
  - `member-dashboard.spec.ts` - Member features
  - `admin-dashboard.spec.ts` - Admin operations

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- helpers.test.ts

# Run with coverage
npm run test:coverage

# Watch mode (re-run on file changes)
npm test -- --watch
```

## Test Coverage Targets
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Mocking

### Supabase Mocking
```typescript
import { vi } from "vitest";

const mockSupabase = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
    insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
  }),
};
```

### API Mocking
```typescript
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post("/api/giving/transactions", (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);
```

## Debugging Tests

```bash
# Enable debug output
npm test -- --reporter=verbose

# Run single test
npm test -- -t "test name"

# Debug mode (uses Node inspector)
node --inspect-brk node_modules/.bin/vitest
```
