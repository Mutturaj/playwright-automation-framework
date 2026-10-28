import { test, expect } from '@playwright/test';

/**
 * Locator Strategies - SDET Interview Essential
 * Different ways to locate elements on a page
 * Best practices for writing robust selectors
 */

test.describe('Locator Strategies', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('Locate by Role (Recommended)', async ({ page }) => {
    // By role - most accessible and reliable way
    const heading = page.getByRole('heading', { name: 'todos' });
    await expect(heading).toBeVisible();

    // Button by role
    // await page.getByRole('button', { name: 'Submit' }).click();

    // Link by role
    // await page.getByRole('link', { name: 'Home' }).click();

    // Textbox by role
    // await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
  });

  test('Locate by Text', async ({ page }) => {
    // Get by exact text
    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    await expect(newTodoInput).toBeVisible();

    // Get by text content
    // await page.getByText('Sign in').click();

    // Get by text with regex
    // await page.getByText(/sign in/i).click();

    // Get by partial text
    // await page.getByText('Sign', { exact: false }).click();
  });

  test('Locate by Label', async ({ page }) => {
    // Useful for form inputs
    // await page.getByLabel('Email').fill('test@example.com');
    // await page.getByLabel('Password').fill('password123');
    // await page.getByLabel('Remember me').check();
  });

  test('Locate by Placeholder', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Learn Playwright');
    await expect(input).toHaveValue('Learn Playwright');
  });

  test('Locate by Test ID (Recommended for testing)', async ({ page }) => {
    // Using data-testid attribute (best practice)
    // await page.getByTestId('submit-button').click();
    // await page.getByTestId('username-input').fill('testuser');

    // Custom test id attribute
    // await page.locator('[data-test="custom-button"]').click();
  });

  test('Locate by CSS Selector', async ({ page }) => {
    // By class
    const input = page.locator('.new-todo');
    await input.fill('CSS Selector Example');

    // By ID
    // await page.locator('#username').fill('testuser');

    // By attribute
    // await page.locator('[type="submit"]').click();

    // By complex CSS
    // await page.locator('div.container > button.primary').click();
  });

  test('Locate by XPath', async ({ page }) => {
    // XPath selectors
    const input = page.locator('//input[@class="new-todo"]');
    await input.fill('XPath Example');

    // XPath with text
    // await page.locator('//button[text()="Submit"]').click();

    // XPath with contains
    // await page.locator('//div[contains(@class, "error")]').isVisible();
  });

  test('Chaining and Filtering Locators', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Chain locators
    const docs = page.locator('nav').locator('a').filter({ hasText: 'Docs' });

    // Filter by text
    const buttons = page.locator('button').filter({ hasText: 'Get started' });

    // Filter by has (containing another element)
    // const productCard = page.locator('.card').filter({ has: page.locator('text="On Sale"') });

    // Get by nth element
    // await page.locator('li').nth(2).click();

    // First and last
    // await page.locator('li').first().click();
    // await page.locator('li').last().click();
  });

  test('Locate within another element', async ({ page }) => {
    // Find element within a parent
    const header = page.locator('header');
    const input = header.locator('.new-todo');
    await input.fill('Nested locator');
  });

  test('Multiple elements and count', async ({ page }) => {
    await page.locator('.new-todo').fill('Task 1');
    await page.locator('.new-todo').press('Enter');
    await page.locator('.new-todo').fill('Task 2');
    await page.locator('.new-todo').press('Enter');

    // Count elements
    const todoCount = await page.locator('.todo-list li').count();
    console.log('Number of todos:', todoCount);
    expect(todoCount).toBeGreaterThan(0);
  });

  test('Evaluate locator visibility and state', async ({ page }) => {
    const input = page.locator('.new-todo');

    // Check if visible
    await expect(input).toBeVisible();

    // Check if enabled
    await expect(input).toBeEnabled();

    // Check if editable
    await expect(input).toBeEditable();
  });
});
