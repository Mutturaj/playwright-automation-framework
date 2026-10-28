# 🎯 Top Playwright Interview Questions for SDET

## Table of Contents
1. [Basic Questions](#basic-questions)
2. [Locators & Selectors](#locators--selectors)
3. [Waits & Synchronization](#waits--synchronization)
4. [Test Organization](#test-organization)
5. [Advanced Topics](#advanced-topics)
6. [API Testing](#api-testing)
7. [Best Practices](#best-practices)

---

## Basic Questions

### Q1: What is Playwright?
**Answer:**
Playwright is an open-source automation testing framework by Microsoft for testing web applications. It supports multiple browsers (Chromium, Firefox, WebKit) and provides:
- Cross-browser testing
- Auto-waiting for elements
- Network interception
- Mobile emulation
- API testing capabilities
- TypeScript support

**Code Example:** See `01-basic-navigation/01-page-navigation.spec.ts`

---

### Q2: What are the advantages of Playwright over Selenium?
**Answer:**
1. **Auto-waiting**: Built-in smart waits (no need for explicit waits)
2. **Faster execution**: Better performance
3. **Network control**: Intercept and mock network requests
4. **Multiple contexts**: Test multiple scenarios in parallel
5. **Better mobile emulation**: Native device emulation
6. **API testing**: Built-in request fixture
7. **Modern architecture**: More stable, less flaky tests

---

### Q3: How do you install and setup Playwright?
**Answer:**
```bash
# Install Playwright
npm init playwright@latest

# Install specific browsers
npx playwright install chromium firefox webkit

# Run tests
npx playwright test

# Open UI mode
npx playwright test --ui
```

---

## Locators & Selectors

### Q4: What are the different locator strategies in Playwright?
**Answer:**
```typescript
// 1. By Role (Recommended ✅)
page.getByRole('button', { name: 'Submit' })

// 2. By Text
page.getByText('Sign in')

// 3. By Label
page.getByLabel('Email')

// 4. By Placeholder
page.getByPlaceholder('Enter username')

// 5. By Test ID (Best for testing ✅)
page.getByTestId('submit-button')

// 6. By CSS Selector
page.locator('.btn-primary')
page.locator('#username')

// 7. By XPath
page.locator('//button[text()="Submit"]')
```

**Reference:** `02-locators/01-locator-strategies.spec.ts`

---

### Q5: What is the recommended way to select elements in Playwright?
**Answer:**
**Priority order:**
1. `getByRole()` - Most accessible and resilient
2. `getByTestId()` - Explicit test identifiers
3. `getByLabel()` - For form inputs
4. `getByPlaceholder()` - For inputs with placeholders
5. `getByText()` - For unique text content
6. CSS/XPath - Last resort

**Example:**
```typescript
// ✅ GOOD - Resilient to changes
await page.getByRole('button', { name: 'Login' }).click();
await page.getByTestId('username-input').fill('test@example.com');

// ❌ BAD - Fragile, breaks easily
await page.locator('body > div:nth-child(3) > button.btn').click();
```

---

### Q6: How do you handle dynamic IDs in Playwright?
**Answer:**
```typescript
// 1. Use partial attribute matching
page.locator('[id^="user-"]') // Starts with "user-"
page.locator('[id$="-submit"]') // Ends with "-submit"
page.locator('[id*="dynamic"]') // Contains "dynamic"

// 2. Use text content
page.getByText('Submit')

// 3. Use test IDs (best practice)
page.getByTestId('submit-btn')

// 4. Use relative locators
page.locator('form').locator('button')
```

---

## Waits & Synchronization

### Q7: What are the different types of waits in Playwright? ⭐ MOST ASKED!
**Answer:**

**1. Auto-Waiting (Built-in) ✅**
```typescript
// Playwright automatically waits for:
// - Element to be attached to DOM
// - Element to be visible
// - Element to be stable (not animating)
// - Element to receive events (not obscured)

await page.locator('#button').click(); // Auto-waits!
```

**2. waitForSelector**
```typescript
await page.locator('#dynamic-element').waitFor({ state: 'visible' });
```

**3. waitForLoadState**
```typescript
await page.waitForLoadState('load'); // Wait for load event
await page.waitForLoadState('networkidle'); // Wait for network
await page.waitForLoadState('domcontentloaded');
```

**4. waitForURL**
```typescript
await page.waitForURL('**/dashboard');
await page.waitForURL(/.*profile.*/);
```

**5. waitForResponse**
```typescript
const response = await page.waitForResponse('**/api/users');
```

**6. waitForFunction**
```typescript
await page.waitForFunction(() => {
  return document.querySelector('#status')?.textContent === 'Ready';
});
```

**7. waitForTimeout (❌ Avoid!)**
```typescript
await page.waitForTimeout(5000); // Hard wait - use only as last resort
```

**Reference:** `04-waits/01-all-wait-types.spec.ts` (MUST READ!)

---

### Q8: When would you use explicit waits vs auto-waiting?
**Answer:**
**Use Auto-Waiting (default):**
- For standard interactions (click, fill, etc.)
- When elements have predictable behavior

**Use Explicit Waits:**
- Waiting for specific API responses
- Waiting for URL changes
- Custom conditions (waitForFunction)
- Waiting for loading indicators to disappear
- Network requests to complete

**Example:**
```typescript
// Auto-wait is enough
await page.locator('#button').click();

// Need explicit wait
await page.locator('#loading-spinner').waitFor({ state: 'hidden' });
await page.waitForResponse('**/api/data');
```

---

## Test Organization

### Q9: Explain test hooks in Playwright. ⭐
**Answer:**

**Hooks available:**
```typescript
test.beforeAll(async () => {
  // Runs ONCE before all tests in the file
  // Use for: Setup test data, database seeding
});

test.beforeEach(async ({ page }) => {
  // Runs BEFORE EACH test
  // Use for: Navigation, login, reset state
  await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
  // Runs AFTER EACH test
  // Use for: Cleanup, logout, screenshots
  await page.screenshot({ path: 'test-result.png' });
});

test.afterAll(async () => {
  // Runs ONCE after all tests
  // Use for: Cleanup, close connections
});
```

**Reference:** `08-hooks/01-test-hooks.spec.ts`

---

### Q10: How do you run tests in parallel in Playwright?
**Answer:**

**Default Behavior:** Playwright runs tests in parallel by default!

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4, // Number of parallel workers
  fullyParallel: true, // Run all tests in parallel
});
```

**Serial Execution:**
```typescript
test.describe.serial('Login Flow', () => {
  // These tests run ONE AFTER ANOTHER
  test('step 1', async ({ page }) => { /* ... */ });
  test('step 2', async ({ page }) => { /* ... */ });
  test('step 3', async ({ page }) => { /* ... */ });
});
```

**Command Line:**
```bash
# Run with 4 workers
npx playwright test --workers=4

# Run serially (1 worker)
npx playwright test --workers=1

# Run fully parallel
npx playwright test --fully-parallel
```

**Reference:** `10-parallel-execution/01-parallel-tests.spec.ts`

---

### Q11: How do you handle multiple elements in Playwright?
**Answer:**
```typescript
// 1. Count elements
const count = await page.locator('.item').count();

// 2. Get all text contents
const texts = await page.locator('.item').allTextContents();

// 3. Access by index
await page.locator('.item').nth(2).click(); // 3rd item
await page.locator('.item').first().click(); // First item
await page.locator('.item').last().click(); // Last item

// 4. Iterate through elements
const items = page.locator('.item');
for (let i = 0; i < await items.count(); i++) {
  const text = await items.nth(i).textContent();
  console.log(text);
}

// 5. Filter elements
const activeItems = page.locator('.item').filter({ hasText: 'Active' });
```

**Reference:** `09-lists-tables/01-handle-lists.spec.ts`

---

## Advanced Topics

### Q12: How do you handle iframes in Playwright?
**Answer:**

**Method 1: frameLocator (Recommended ✅)**
```typescript
const frame = page.frameLocator('#my-iframe');
await frame.locator('#username').fill('testuser');
await frame.locator('button').click();
```

**Method 2: frame()**
```typescript
const frame = page.frame({ name: 'myFrame' });
await frame!.locator('#button').click();
```

**Nested iframes:**
```typescript
const outerFrame = page.frameLocator('#outer-frame');
const innerFrame = outerFrame.frameLocator('#inner-frame');
await innerFrame.locator('#content').click();
```

**Reference:** `07-iframes/01-iframe-handling.spec.ts`

---

### Q13: How do you handle dropdowns in Playwright?
**Answer:**

**Standard HTML Select:**
```typescript
// By visible text
await page.locator('#country').selectOption({ label: 'United States' });

// By value
await page.locator('#country').selectOption('us');

// By index
await page.locator('#country').selectOption({ index: 2 });

// Multiple selections
await page.locator('#languages').selectOption(['js', 'py', 'java']);
```

**Custom Dropdown:**
```typescript
// Click to open
await page.locator('.dropdown-toggle').click();

// Select option
await page.locator('.dropdown-item').filter({ hasText: 'Option 2' }).click();
```

**Reference:** `03-interactions/03-dropdowns.spec.ts`

---

### Q14: How do you take screenshots in Playwright?
**Answer:**

```typescript
// Full page screenshot
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// Viewport screenshot
await page.screenshot({ path: 'viewport.png' });

// Element screenshot
await page.locator('#header').screenshot({ path: 'header.png' });

// Screenshot on test failure (in config)
use: {
  screenshot: 'only-on-failure',
}

// Screenshot in afterEach hook
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await page.screenshot({ 
      path: `failure-${testInfo.title}.png` 
    });
  }
});
```

**Reference:** `05-screenshots/01-screenshots.spec.ts`

---

### Q15: How do you handle alerts, confirms, and prompts?
**Answer:**

```typescript
// Handle alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});
await page.locator('#alertBtn').click();

// Handle confirm (Accept)
page.on('dialog', async dialog => {
  await dialog.accept(); // Click OK
});

// Handle confirm (Dismiss)
page.on('dialog', async dialog => {
  await dialog.dismiss(); // Click Cancel
});

// Handle prompt with input
page.on('dialog', async dialog => {
  await dialog.accept('John Doe');
});
```

**Reference:** `12-dialogs-alerts/01-handle-dialogs.spec.ts`

---

## API Testing

### Q16: How do you perform API testing in Playwright?
**Answer:**

```typescript
test('GET request', async ({ request }) => {
  const response = await request.get('https://api.example.com/users');
  
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data).toHaveLength(10);
});

test('POST request', async ({ request }) => {
  const response = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    headers: {
      'Authorization': 'Bearer token123'
    }
  });
  
  expect(response.status()).toBe(201);
});

test('PUT request', async ({ request }) => {
  const response = await request.put('https://api.example.com/users/1', {
    data: { name: 'Updated Name' }
  });
  
  expect(response.ok()).toBeTruthy();
});

test('DELETE request', async ({ request }) => {
  const response = await request.delete('https://api.example.com/users/1');
  expect(response.status()).toBe(204);
});
```

**Reference:** `11-api-testing/01-api-basics.spec.ts`

---

## Best Practices

### Q17: What are Playwright best practices?

**Answer:**

**1. Use proper locators:**
```typescript
// ✅ GOOD
page.getByRole('button', { name: 'Submit' })
page.getByTestId('login-button')

// ❌ BAD
page.locator('body > div > button:nth-child(3)')
```

**2. Leverage auto-waiting:**
```typescript
// ✅ GOOD - Auto-waits
await page.locator('#button').click();

// ❌ BAD - Hard wait
await page.waitForTimeout(5000);
await page.locator('#button').click();
```

**3. Write independent tests:**
```typescript
// ✅ GOOD - Each test is isolated
test('test 1', async ({ page }) => {
  await page.goto('https://example.com');
  // Test logic
});

// ❌ BAD - Tests depend on each other
```

**4. Use hooks properly:**
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com/login');
  // Login logic
});
```

**5. Use descriptive test names:**
```typescript
// ✅ GOOD
test('User should be able to login with valid credentials', ...);

// ❌ BAD
test('test1', ...);
```

---

### Q18: How do you debug tests in Playwright?

**Answer:**

**1. UI Mode (Best for debugging):**
```bash
npx playwright test --ui
```

**2. Debug Mode:**
```bash
npx playwright test --debug
```

**3. page.pause():**
```typescript
await page.goto('https://example.com');
await page.pause(); // Pauses execution
await page.locator('#button').click();
```

**4. Console logs:**
```typescript
console.log('Current URL:', page.url());
console.log('Element count:', await page.locator('.item').count());
```

**5. Screenshots:**
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

**6. Trace Viewer:**
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

### Q19: How do you handle authentication in Playwright?

**Answer:**

**Method 1: Login in beforeEach**
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#login-btn');
  await page.waitForURL('**/dashboard');
});
```

**Method 2: Save auth state**
```typescript
// Login once and save state
const { chromium } = require('@playwright/test');
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://example.com/login');
// Login...
await context.storageState({ path: 'auth.json' });

// Use saved state
test.use({ storageState: 'auth.json' });
```

**Method 3: API login**
```typescript
test.beforeEach(async ({ request, context }) => {
  const response = await request.post('/api/login', {
    data: { username: 'test', password: 'pass' }
  });
  
  const cookies = response.headers()['set-cookie'];
  await context.addCookies(/* parse cookies */);
});
```

---

### Q20: Explain Page Object Model in Playwright

**Answer:**

**Page Object Model (POM)** separates page structure from test logic.

**Example:**

**LoginPage.ts:**
```typescript
export class LoginPage {
  constructor(private page: Page) {}

  private usernameInput = () => this.page.locator('#username');
  private passwordInput = () => this.page.locator('#password');
  private loginButton = () => this.page.locator('#login-btn');

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async goto() {
    await this.page.goto('https://example.com/login');
  }
}
```

**Test file:**
```typescript
import { LoginPage } from './pages/LoginPage';

test('Login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'password123');
  
  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

## Summary Checklist ✅

- [ ] Understand locator strategies (getByRole, getByTestId)
- [ ] Know all types of waits (auto-waiting vs explicit)
- [ ] Can handle dropdowns (select, custom)
- [ ] Understand hooks (beforeEach, afterEach, etc.)
- [ ] Can work with lists and tables
- [ ] Know how to handle iframes
- [ ] Understand parallel vs serial execution
- [ ] Can write API tests
- [ ] Can handle dialogs/alerts
- [ ] Know debugging techniques
- [ ] Understand Page Object Model
- [ ] Know best practices

**Good luck with your SDET interview! 🚀**
