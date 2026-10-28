import { test, expect } from '@playwright/test';

/**
 * Parallel Test Execution in Playwright
 * IMPORTANT SDET Interview Topic
 * Learn how to run tests in parallel for faster execution
 */

/**
 * BY DEFAULT, Playwright runs tests in PARALLEL!
 * Each test file runs in parallel
 * Tests within a file run in parallel by default
 */

test.describe('Parallel Execution - Default Behavior', () => {

  test('Test 1 - runs in parallel', async ({ page }) => {
    console.log('Test 1 started at:', new Date().toISOString());
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    await page.waitForTimeout(2000); // Simulate work
    console.log('Test 1 finished at:', new Date().toISOString());
  });

  test('Test 2 - runs in parallel', async ({ page }) => {
    console.log('Test 2 started at:', new Date().toISOString());
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveTitle(/TodoMVC/);
    await page.waitForTimeout(2000); // Simulate work
    console.log('Test 2 finished at:', new Date().toISOString());
  });

  test('Test 3 - runs in parallel', async ({ page }) => {
    console.log('Test 3 started at:', new Date().toISOString());
    await page.goto('https://playwright.dev/docs/intro');
    await page.waitForTimeout(2000); // Simulate work
    console.log('Test 3 finished at:', new Date().toISOString());
  });

  // All three tests above run simultaneously in different worker processes
});

test.describe('Serial Execution - Sequential Tests', () => {

  // Use .serial to run tests one after another
  test.describe.serial('Login flow - must run in order', () => {

    test('Step 1: Navigate to login page', async ({ page }) => {
      console.log('Step 1 executing...');
      await page.setContent(`
        <html>
          <body>
            <h1>Login Page</h1>
            <form id="loginForm">
              <input type="text" id="username" />
              <input type="password" id="password" />
              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `);
      await expect(page.locator('h1')).toHaveText('Login Page');
    });

    test('Step 2: Fill login form', async ({ page }) => {
      console.log('Step 2 executing...');
      // This test depends on Step 1 being completed
      await page.setContent(`
        <html>
          <body>
            <form id="loginForm">
              <input type="text" id="username" />
              <input type="password" id="password" />
              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `);
      await page.locator('#username').fill('testuser');
      await page.locator('#password').fill('password123');
    });

    test('Step 3: Submit and verify', async ({ page }) => {
      console.log('Step 3 executing...');
      // This test depends on Step 2 being completed
      await page.setContent(`
        <html>
          <body>
            <h1>Dashboard</h1>
            <p>Welcome, testuser!</p>
          </body>
        </html>
      `);
      await expect(page.locator('h1')).toHaveText('Dashboard');
    });

    // These tests run ONE AFTER ANOTHER, not in parallel
  });
});

test.describe('Configure Workers', () => {

  /**
   * Workers control parallelization
   * Set in playwright.config.ts:
   *   workers: 4 - runs 4 tests simultaneously
   *   workers: 1 - runs tests serially (one at a time)
   *   workers: undefined - uses CPU cores
   */

  test('Understanding workers - Test A', async ({ page }) => {
    console.log('Worker Test A');
    await page.goto('https://playwright.dev/');
    await page.waitForTimeout(1000);
  });

  test('Understanding workers - Test B', async ({ page }) => {
    console.log('Worker Test B');
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.waitForTimeout(1000);
  });

  test('Understanding workers - Test C', async ({ page }) => {
    console.log('Worker Test C');
    await page.goto('https://playwright.dev/docs/intro');
    await page.waitForTimeout(1000);
  });

  // With workers: 3, all three tests run simultaneously
  // With workers: 1, tests run one by one
});

test.describe('Fully Parallel Mode', () => {

  // Configure at describe level
  test.describe.configure({ mode: 'parallel' });

  test('Parallel test 1', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    console.log('Parallel 1 executing');
    await page.waitForTimeout(500);
  });

  test('Parallel test 2', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('Parallel 2 executing');
    await page.waitForTimeout(500);
  });

  test('Parallel test 3', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    console.log('Parallel 3 executing');
    await page.waitForTimeout(500);
  });

  test('Parallel test 4', async ({ page }) => {
    await page.goto('https://playwright.dev/community/welcome');
    console.log('Parallel 4 executing');
    await page.waitForTimeout(500);
  });

  // All tests run in parallel even if they're in the same file
});

test.describe('Serial Mode - Execution Order Matters', () => {

  // Configure serial mode at describe level
  test.describe.configure({ mode: 'serial' });

  let sharedState: any = {};

  test('Serial 1: Setup', async () => {
    console.log('Serial 1: Setting up data');
    sharedState.value = 'initialized';
    expect(sharedState.value).toBe('initialized');
  });

  test('Serial 2: Use data from test 1', async () => {
    console.log('Serial 2: Using data from test 1');
    expect(sharedState.value).toBe('initialized');
    sharedState.value = 'modified';
  });

  test('Serial 3: Use data from test 2', async () => {
    console.log('Serial 3: Using data from test 2');
    expect(sharedState.value).toBe('modified');
  });

  // These tests MUST run in order because they share state
});

test.describe('Test with Dependencies using fullyParallel', () => {

  // Set fullyParallel to false for this suite
  test.describe.configure({ mode: 'default' });

  test('Independent test 1', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    console.log('Independent 1');
  });

  test('Independent test 2', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('Independent 2');
  });

  // With mode: 'default', tests run in parallel within available workers
});

test.describe('Real-World Parallel Scenarios', () => {

  test('Search functionality - Test 1', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.locator('.new-todo').fill('Parallel Test 1');
    await page.locator('.new-todo').press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    console.log('Search test 1 completed');
  });

  test('Add item functionality - Test 2', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.locator('.new-todo').fill('Parallel Test 2');
    await page.locator('.new-todo').press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    console.log('Add item test 2 completed');
  });

  test('Complete item functionality - Test 3', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.locator('.new-todo').fill('Parallel Test 3');
    await page.locator('.new-todo').press('Enter');
    await page.locator('.todo-list li .toggle').check();
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    console.log('Complete item test 3 completed');
  });

  // These tests are independent and can safely run in parallel
  // Each test starts with a fresh page context
});

test.describe('Parallel with Test Info', () => {

  test('Check test info in parallel execution', async ({ page }, testInfo) => {
    console.log('Test title:', testInfo.title);
    console.log('Worker index:', testInfo.workerIndex);
    console.log('Parallel index:', testInfo.parallelIndex);
    console.log('Project name:', testInfo.project.name);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});

/**
 * COMMAND LINE OPTIONS FOR PARALLEL EXECUTION:
 *
 * Run with specific number of workers:
 *   npx playwright test --workers=4
 *
 * Run tests serially (one at a time):
 *   npx playwright test --workers=1
 *
 * Run fully parallel (ignore config):
 *   npx playwright test --fully-parallel
 *
 * Run specific test file:
 *   npx playwright test parallel-tests.spec.ts --workers=2
 *
 * Run tests in headed mode with 1 worker (for debugging):
 *   npx playwright test --headed --workers=1
 *
 * Run with max workers (use all CPU cores):
 *   npx playwright test --workers=100%
 */

test.describe('Notes on Parallel Execution', () => {

  test('Understanding parallel benefits', async () => {
    /**
     * BENEFITS OF PARALLEL EXECUTION:
     * 1. Faster test execution (multiple tests at once)
     * 2. Better resource utilization (use all CPU cores)
     * 3. Quicker feedback in CI/CD pipelines
     * 4. Reduced overall test suite duration
     *
     * WHEN TO USE SERIAL:
     * 1. Tests that modify shared state
     * 2. Tests that depend on order of execution
     * 3. Database setup/teardown scenarios
     * 4. Tests that use same resource (file, port, etc.)
     *
     * BEST PRACTICES:
     * 1. Write independent tests (no shared state)
     * 2. Use fresh context for each test
     * 3. Clean up resources in afterEach
     * 4. Use test fixtures for isolation
     * 5. Avoid hard-coded delays (use waitFor instead)
     */

    console.log('✅ Parallel execution makes test suites faster!');
    console.log('✅ Write independent, isolated tests for best results');
    console.log('✅ Use serial mode only when absolutely necessary');

    expect(true).toBe(true);
  });
});
