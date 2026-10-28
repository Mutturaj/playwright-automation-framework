import { test, expect } from '@playwright/test';

/**
 * Test Hooks in Playwright
 * CRITICAL SDET Interview Topic
 * Setup and teardown methods for better test organization
 */

test.describe('Basic Hooks - beforeEach and afterEach', () => {

  // Runs before each test in this describe block
  test.beforeEach(async ({ page }) => {
    console.log('--- Starting new test ---');
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('Navigated to TodoMVC');
  });

  // Runs after each test in this describe block
  test.afterEach(async ({ page }) => {
    console.log('--- Test completed ---');
    // Clean up can go here (optional)
    await page.close();
  });

  test('Add a new todo', async ({ page }) => {
    await page.locator('.new-todo').fill('Buy groceries');
    await page.locator('.new-todo').press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(1);
    console.log('Test: Add todo completed');
  });

  test('Add multiple todos', async ({ page }) => {
    await page.locator('.new-todo').fill('Task 1');
    await page.locator('.new-todo').press('Enter');
    await page.locator('.new-todo').fill('Task 2');
    await page.locator('.new-todo').press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(2);
    console.log('Test: Add multiple todos completed');
  });

  test('Complete a todo', async ({ page }) => {
    await page.locator('.new-todo').fill('Complete me');
    await page.locator('.new-todo').press('Enter');

    await page.locator('.todo-list li .toggle').check();

    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    console.log('Test: Complete todo completed');
  });
});

test.describe('beforeAll and afterAll Hooks', () => {

  // Runs ONCE before all tests in this describe block
  test.beforeAll(async () => {
    console.log('=== Suite Setup: beforeAll ===');
    // One-time setup (e.g., database seed, config load)
    console.log('Loading test configuration...');
  });

  // Runs ONCE after all tests in this describe block
  test.afterAll(async () => {
    console.log('=== Suite Teardown: afterAll ===');
    // One-time cleanup
    console.log('Cleaning up test data...');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('First test in suite', async ({ page }) => {
    await page.locator('.new-todo').fill('First test task');
    await page.locator('.new-todo').press('Enter');
    expect(await page.locator('.todo-list li').count()).toBe(1);
  });

  test('Second test in suite', async ({ page }) => {
    await page.locator('.new-todo').fill('Second test task');
    await page.locator('.new-todo').press('Enter');
    expect(await page.locator('.todo-list li').count()).toBe(1);
  });

  test('Third test in suite', async ({ page }) => {
    await page.locator('.new-todo').fill('Third test task');
    await page.locator('.new-todo').press('Enter');
    expect(await page.locator('.todo-list li').count()).toBe(1);
  });
});

test.describe('Nested Hooks', () => {

  test.beforeAll(() => {
    console.log('Outer beforeAll');
  });

  test.beforeEach(() => {
    console.log('Outer beforeEach');
  });

  test.afterEach(() => {
    console.log('Outer afterEach');
  });

  test.afterAll(() => {
    console.log('Outer afterAll');
  });

  test('Outer test', () => {
    console.log('Executing outer test');
    expect(true).toBe(true);
  });

  test.describe('Inner describe block', () => {

    test.beforeAll(() => {
      console.log('  Inner beforeAll');
    });

    test.beforeEach(() => {
      console.log('  Inner beforeEach');
    });

    test.afterEach(() => {
      console.log('  Inner afterEach');
    });

    test.afterAll(() => {
      console.log('  Inner afterAll');
    });

    test('Inner test 1', () => {
      console.log('  Executing inner test 1');
      expect(true).toBe(true);
    });

    test('Inner test 2', () => {
      console.log('  Executing inner test 2');
      expect(true).toBe(true);
    });
  });
});

test.describe('Hooks with Page Fixture', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate before each test
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('Page loaded in beforeEach');
  });

  test('Test with automatic page setup', async ({ page }) => {
    // Page is already loaded from beforeEach
    await expect(page).toHaveTitle(/TodoMVC/);
    console.log('Test executed with pre-loaded page');
  });
});

test.describe('Real-World Hook Scenarios', () => {

  // Shared test data
  let testData: { username: string; password: string; };

  test.beforeAll(async () => {
    // Load test data once for all tests
    testData = {
      username: 'testuser@example.com',
      password: 'SecurePass123'
    };
    console.log('Test data loaded:', testData);
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.setContent(`
      <html>
        <body>
          <form id="loginForm">
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button type="submit">Login</button>
          </form>
          <div id="dashboard" style="display: none;">
            <h1>Welcome to Dashboard</h1>
            <button id="logoutBtn">Logout</button>
          </div>
          <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
              e.preventDefault();
              const username = document.getElementById('username').value;
              const password = document.getElementById('password').value;
              if (username && password) {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
              }
            });
          </script>
        </body>
      </html>
    `);

    // Perform login
    await page.locator('#username').fill(testData.username);
    await page.locator('#password').fill(testData.password);
    await page.locator('button[type="submit"]').click();

    // Verify logged in
    await expect(page.locator('#dashboard')).toBeVisible();
    console.log('User logged in via beforeEach hook');
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test
    await page.locator('#logoutBtn').click().catch(() => {
      console.log('Logout button not found - user may already be logged out');
    });
    console.log('Cleanup: Attempted logout');
  });

  test('Dashboard test 1 - Check welcome message', async ({ page }) => {
    await expect(page.locator('#dashboard h1')).toHaveText('Welcome to Dashboard');
    console.log('Test 1: Verified welcome message');
  });

  test('Dashboard test 2 - Verify logout button exists', async ({ page }) => {
    await expect(page.locator('#logoutBtn')).toBeVisible();
    console.log('Test 2: Verified logout button');
  });
});

test.describe('Conditional Hooks', () => {

  // Run hook based on condition
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running test: ${testInfo.title}`);

    // Conditional logic based on test
    if (testInfo.title.includes('mobile')) {
      await page.setViewportSize({ width: 375, height: 667 });
      console.log('Set mobile viewport');
    } else {
      await page.setViewportSize({ width: 1920, height: 1080 });
      console.log('Set desktop viewport');
    }

    await page.goto('https://playwright.dev/');
  });

  test('Desktop test - wide layout', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
    console.log('Running desktop test');
  });

  test('Mobile test - narrow layout [mobile]', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    console.log('Running mobile test');
  });
});

test.describe('Hooks with Screenshots', () => {

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot after each test
    const testName = testInfo.title.replace(/\s+/g, '-');
    const status = testInfo.status;

    await page.screenshot({
      path: `screenshots/hooks/${status}-${testName}.png`,
      fullPage: true
    });

    console.log(`Screenshot taken: ${status}-${testName}.png`);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('Passing test - screenshot will show success', async ({ page }) => {
    await page.locator('.new-todo').fill('Success task');
    await page.locator('.new-todo').press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });

  test('Another passing test', async ({ page }) => {
    await expect(page).toHaveTitle(/TodoMVC/);
  });
});

test.describe('Error Handling in Hooks', () => {

  test.beforeEach(async ({ page }) => {
    try {
      await page.goto('https://demo.playwright.dev/todomvc', { timeout: 30000 });
      console.log('Page loaded successfully');
    } catch (error) {
      console.error('Failed to load page in beforeEach:', error);
      throw error; // Re-throw to fail the test
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      console.log('Test failed - capturing debug info');
      await page.screenshot({ path: `screenshots/failed-${testInfo.title}.png` });
    }
  });

  test('Test with error handling', async ({ page }) => {
    await expect(page).toHaveTitle(/TodoMVC/);
  });
});

test.describe('Performance Measurement with Hooks', () => {

  let startTime: number;

  test.beforeEach(async ({ page }) => {
    startTime = Date.now();
    await page.goto('https://playwright.dev/');
    console.log('Test started at:', new Date(startTime).toISOString());
  });

  test.afterEach(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Test duration: ${duration}ms`);
  });

  test('Measure test execution time - Test 1', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
    await page.waitForTimeout(1000); // Simulate some work
  });

  test('Measure test execution time - Test 2', async ({ page }) => {
    await page.locator('nav a').first().click();
    await page.waitForTimeout(500);
  });
});

test.describe('Data Cleanup Hooks', () => {

  const createdIds: string[] = [];

  test.beforeEach(async () => {
    console.log('Preparing test data...');
  });

  test.afterEach(async () => {
    // Clean up any created data
    for (const id of createdIds) {
      console.log(`Cleaning up resource: ${id}`);
      // API call to delete resource would go here
    }
    createdIds.length = 0; // Clear the array
  });

  test('Create resource test 1', async () => {
    const resourceId = 'resource-' + Date.now();
    createdIds.push(resourceId);
    console.log('Created:', resourceId);
    expect(createdIds.length).toBeGreaterThan(0);
  });

  test('Create resource test 2', async () => {
    const resourceId = 'resource-' + Date.now();
    createdIds.push(resourceId);
    console.log('Created:', resourceId);
    expect(createdIds.length).toBeGreaterThan(0);
  });
});
