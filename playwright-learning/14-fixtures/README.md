# Fixtures in Playwright 🧩

## What are Fixtures?

**Fixtures** are Playwright's way to set up test environment and share objects between tests. Think of them as "test dependencies" that Playwright automatically provides to your tests.

## Built-in Fixtures

Playwright provides these fixtures out of the box:

- `page` - A fresh Page for each test
- `context` - A fresh BrowserContext for each test  
- `browser` - Shared Browser instance
- `request` - API testing context

## Why Use Fixtures?

✅ **Better than hooks** - More flexible than beforeEach/afterEach  
✅ **Type-safe** - Full TypeScript support  
✅ **Isolated** - Each test gets fresh fixtures  
✅ **Composable** - Fixtures can depend on other fixtures  
✅ **Automatic cleanup** - Teardown always runs

## Quick Example

```typescript
import { test as base } from '@playwright/test';

// Define fixture type
type MyFixtures = {
  authenticatedPage: Page;
};

// Create custom fixture
const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login
    await page.goto('https://example.com/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('#login');
    
    // Provide to test
    await use(page);
    
    // Teardown: Logout
    await page.click('#logout');
  },
});

// Use it!
test('Dashboard test', async ({ authenticatedPage }) => {
  // Already logged in!
  await expect(authenticatedPage.locator('h1')).toHaveText('Dashboard');
});
```

## Files in This Folder

1. **01-fixtures-basics.spec.ts** - Learn all fixture fundamentals
2. **02-advanced-fixtures.spec.ts** - Real-world patterns

## Interview Tips

**Most Asked:**
- Q: "What are fixtures in Playwright?"
- Q: "Difference between fixtures and hooks?"
- Q: "How to create custom fixtures?"
- Q: "What is worker scope vs test scope?"

All answers are in the test files! 🎯
