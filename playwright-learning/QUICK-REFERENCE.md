# 🚀 Playwright Quick Reference Cheat Sheet

## 📌 Navigation

```typescript
await page.goto('https://example.com');
await page.goBack();
await page.goForward();
await page.reload();

// With wait options
await page.goto('url', { waitUntil: 'networkidle' });
await page.goto('url', { waitUntil: 'domcontentloaded' });
```

---

## 🎯 Locators (Selection Strategies)

```typescript
// By Role (Recommended ✅)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Username' })
page.getByRole('link', { name: 'Home' })

// By Test ID (Best for testing ✅)
page.getByTestId('submit-btn')
page.getByTestId('username-input')

// By Text
page.getByText('Sign in')
page.getByText(/sign in/i) // Regex

// By Label
page.getByLabel('Email')
page.getByLabel('Password')

// By Placeholder
page.getByPlaceholder('Enter username')

// CSS Selectors
page.locator('.class-name')
page.locator('#id')
page.locator('[data-test="value"]')

// XPath
page.locator('//button[text()="Submit"]')
page.locator('//input[@id="username"]')

// Chaining
page.locator('nav').locator('a').first()
page.locator('.list').locator('li').nth(2)
```

---

## ⚡ Actions

```typescript
// Click
await page.locator('#button').click();
await page.locator('#button').dblclick();
await page.locator('#button').click({ button: 'right' });

// Fill & Type
await page.locator('#input').fill('text');
await page.locator('#input').type('text', { delay: 100 });
await page.locator('#input').clear();

// Press keys
await page.locator('#input').press('Enter');
await page.locator('#input').press('Control+A');

// Hover
await page.locator('#element').hover();

// Focus
await page.locator('#input').focus();

// Check/Uncheck
await page.locator('#checkbox').check();
await page.locator('#checkbox').uncheck();

// Select dropdown
await page.locator('#dropdown').selectOption('value');
await page.locator('#dropdown').selectOption({ label: 'Text' });
await page.locator('#dropdown').selectOption({ index: 2 });
```

---

## ⏱️ Waits

```typescript
// Auto-waiting (built-in) - No explicit wait needed
await page.locator('#button').click(); // ✅ Automatically waits!

// Wait for element
await page.locator('#element').waitFor({ state: 'visible' });
await page.locator('#element').waitFor({ state: 'hidden' });
await page.locator('#element').waitFor({ state: 'attached' });

// Wait for page load
await page.waitForLoadState('load');
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');

// Wait for URL
await page.waitForURL('**/dashboard');
await page.waitForURL(/.*profile.*/);

// Wait for response
await page.waitForResponse('**/api/users');
await page.waitForResponse(response => 
  response.url().includes('/api/') && response.status() === 200
);

// Wait for function
await page.waitForFunction(() => 
  document.querySelector('#status')?.textContent === 'Ready'
);

// Hard wait (❌ Avoid when possible)
await page.waitForTimeout(5000);
```

---

## ✅ Assertions

```typescript
// Page assertions
await expect(page).toHaveTitle(/Title/);
await expect(page).toHaveURL(/dashboard/);

// Element visibility
await expect(page.locator('#element')).toBeVisible();
await expect(page.locator('#element')).toBeHidden();

// Element state
await expect(page.locator('#input')).toBeEnabled();
await expect(page.locator('#input')).toBeDisabled();
await expect(page.locator('#input')).toBeEditable();
await expect(page.locator('#input')).toBeFocused();

// Text content
await expect(page.locator('#element')).toHaveText('text');
await expect(page.locator('#element')).toContainText('partial');

// Input values
await expect(page.locator('#input')).toHaveValue('value');

// Checkboxes
await expect(page.locator('#checkbox')).toBeChecked();
await expect(page.locator('#checkbox')).not.toBeChecked();

// Count
await expect(page.locator('.item')).toHaveCount(5);

// Attributes
await expect(page.locator('#link')).toHaveAttribute('href', '/home');

// CSS
await expect(page.locator('#element')).toHaveCSS('color', 'rgb(255, 0, 0)');
```

---

## 📋 Multiple Elements

```typescript
// Count
const count = await page.locator('.item').count();

// Get all texts
const texts = await page.locator('.item').allTextContents();

// Access by index
await page.locator('.item').nth(0).click(); // First
await page.locator('.item').nth(2).click(); // Third
await page.locator('.item').first().click(); // First
await page.locator('.item').last().click(); // Last

// Iterate
const items = page.locator('.item');
for (let i = 0; i < await items.count(); i++) {
  const text = await items.nth(i).textContent();
  console.log(text);
}

// Filter
const activeItems = page.locator('.item').filter({ hasText: 'Active' });
const itemsWithButton = page.locator('.item').filter({ 
  has: page.locator('button') 
});
```

---

## 🖼️ IFrames

```typescript
// frameLocator (Recommended ✅)
const frame = page.frameLocator('#my-iframe');
await frame.locator('#button').click();

// Nested iframes
const outerFrame = page.frameLocator('#outer');
const innerFrame = outerFrame.frameLocator('#inner');
await innerFrame.locator('#content').click();

// frame() method
const frame = page.frame({ name: 'frameName' });
await frame!.locator('#element').click();
```

---

## 📸 Screenshots

```typescript
// Full page
await page.screenshot({ path: 'page.png', fullPage: true });

// Viewport
await page.screenshot({ path: 'viewport.png' });

// Element
await page.locator('#element').screenshot({ path: 'element.png' });

// JPEG with quality
await page.screenshot({ 
  path: 'page.jpg', 
  type: 'jpeg', 
  quality: 80 
});
```

---

## 🎣 Hooks

```typescript
test.beforeAll(async () => {
  // Runs ONCE before all tests
});

test.beforeEach(async ({ page }) => {
  // Runs BEFORE EACH test
  await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
  // Runs AFTER EACH test
  await page.screenshot({ path: 'result.png' });
});

test.afterAll(async () => {
  // Runs ONCE after all tests
});
```

---

## 🧩 Fixtures

```typescript
// Built-in fixtures
test('Use page fixture', async ({ page, context, browser, request }) => {
  // page, context, browser, request are built-in fixtures
  await page.goto('https://example.com');
});

// Custom fixture
import { test as base } from '@playwright/test';

type MyFixtures = {
  todoPage: any;
};

const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    // Setup
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // Use
    await use(page);
    
    // Teardown (runs even if test fails)
    console.log('Cleanup');
  },
});

// Use custom fixture
test('Add todo', async ({ todoPage }) => {
  // todoPage is already at TodoMVC!
  await todoPage.locator('.new-todo').fill('Task');
  await todoPage.locator('.new-todo').press('Enter');
});

// Worker-scoped fixture (shared across tests)
const test = base.extend<{}, WorkerFixtures>({
  workerData: [async ({}, use) => {
    // Setup once per worker
    const data = await loadExpensiveData();
    await use(data);
    // Teardown once per worker
  }, { scope: 'worker' }],
});

// Auto fixture (runs for every test automatically)
const test = base.extend<AutoFixtures>({
  autoLog: [async ({}, use, testInfo) => {
    await use();
    console.log('Test:', testInfo.title, 'Status:', testInfo.status);
  }, { auto: true }],
});
```

---

## 🚨 Dialogs & Alerts

```typescript
// Handle alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});

// Handle confirm
page.on('dialog', async dialog => {
  await dialog.accept(); // Click OK
  // OR
  await dialog.dismiss(); // Click Cancel
});

// Handle prompt
page.on('dialog', async dialog => {
  await dialog.accept('input text');
});
```

---

## 🪟 Multiple Tabs & Windows

```typescript
// Open new tab when user clicks link
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click()
]);
await newPage.waitForLoadState();

// Open new tab programmatically
const newTab = await context.newPage();
await newTab.goto('https://example.com');

// Switch between tabs (just use the reference!)
await page.locator('#button1').click(); // Tab 1
await newTab.locator('#button2').click(); // Tab 2

// Get all open tabs
const allPages = context.pages();
console.log('Total tabs:', allPages.length);

// Find tab by URL
const githubTab = allPages.find(p => p.url().includes('github'));

// Bring tab to front (focus)
await newTab.bringToFront();

// Close tab
await newTab.close();

// Close all tabs except main
const allPages = context.pages();
for (const p of allPages) {
  if (p !== page) await p.close();
}

// Handle popup
page.on('popup', async popup => {
  await popup.waitForLoadState();
  await popup.close();
});
```

---

## 🌐 API Testing

```typescript
// GET
const response = await request.get('https://api.example.com/users');
expect(response.status()).toBe(200);
const data = await response.json();

// POST
await request.post('https://api.example.com/users', {
  data: { name: 'John', email: 'john@example.com' },
  headers: { 'Authorization': 'Bearer token' }
});

// PUT
await request.put('https://api.example.com/users/1', {
  data: { name: 'Updated' }
});

// DELETE
await request.delete('https://api.example.com/users/1');
```

---

## 📜 Scroll

```typescript
// Scroll to element
await page.locator('#element').scrollIntoViewIfNeeded();

// Scroll to top
await page.evaluate(() => window.scrollTo(0, 0));

// Scroll to bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// Scroll by pixels
await page.evaluate(() => window.scrollBy(0, 500));
```

---

## 🎨 Dropdowns

```typescript
// Standard select
await page.locator('#dropdown').selectOption('value');
await page.locator('#dropdown').selectOption({ label: 'Text' });
await page.locator('#dropdown').selectOption({ index: 2 });

// Multi-select
await page.locator('#multi').selectOption(['val1', 'val2', 'val3']);

// Custom dropdown
await page.locator('.dropdown-toggle').click();
await page.locator('.dropdown-item').filter({ hasText: 'Option' }).click();
```

---

## 🔄 Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4, // Run 4 tests in parallel
  fullyParallel: true,
});

// Serial execution
test.describe.serial('Login Flow', () => {
  test('step 1', async ({ page }) => { });
  test('step 2', async ({ page }) => { });
});

// Configure per describe
test.describe.configure({ mode: 'parallel' });
```

**Command line:**
```bash
npx playwright test --workers=4
npx playwright test --workers=1 # Serial
```

---

## 🛠️ Useful Commands

```bash
# Run tests
npx playwright test

# Run specific file
npx playwright test login.spec.ts

# Run by test name pattern
npx playwright test -g "login"

# UI mode (Interactive)
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Headed mode
npx playwright test --headed

# Specific browser
npx playwright test --project=chromium

# Generate report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots

# Parallel workers
npx playwright test --workers=4

# Serial execution
npx playwright test --workers=1
```

---

## 🎯 Page Object Model

```typescript
// pages/LoginPage.ts
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
}

// test.spec.ts
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');
```

---

## 📊 Test Info

```typescript
test('example', async ({ page }, testInfo) => {
  console.log(testInfo.title);
  console.log(testInfo.file);
  console.log(testInfo.status); // passed, failed, timedOut
  console.log(testInfo.workerIndex);
  console.log(testInfo.project.name);
});
```

---

## 🐛 Debugging

```typescript
// Pause execution
await page.pause();

// Console logs
console.log('URL:', page.url());
console.log('Title:', await page.title());

// Screenshot for debugging
await page.screenshot({ path: 'debug.png' });

// Video (in config)
use: {
  video: 'on',
}
```

---

## 🔐 Authentication

```typescript
// Save auth state
await context.storageState({ path: 'auth.json' });

// Use saved state
test.use({ storageState: 'auth.json' });

// Set cookies
await context.addCookies([
  { name: 'session', value: 'abc123', domain: 'example.com', path: '/' }
]);
```

---

## 📝 Best Practices

✅ **DO:**
- Use `getByRole()` and `getByTestId()`
- Leverage auto-waiting
- Write independent tests
- Use hooks for setup/teardown
- Run tests in parallel
- Use descriptive test names

❌ **DON'T:**
- Use brittle CSS selectors
- Use `waitForTimeout` unless necessary
- Write dependent tests
- Use hard-coded waits
- Ignore test failures

---

## 🎓 Useful Links

- [Playwright Docs](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)

---

**Print this and keep it handy! 🚀**
