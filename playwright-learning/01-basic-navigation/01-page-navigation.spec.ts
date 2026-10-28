import { test, expect } from '@playwright/test';

/**
 * Basic Page Navigation Examples
 * Common SDET Interview Topics:
 * - Navigate to URLs
 * - Go back/forward
 * - Reload page
 * - Wait for page load
 */

test.describe('Page Navigation Examples', () => {

  test('Navigate to a URL', async ({ page }) => {
    // Navigate to a website
    await page.goto('https://demo.playwright.dev/todomvc');

    // Verify the page title
    await expect(page).toHaveTitle(/TodoMVC/);

    // Get current URL
    const url = page.url();
    console.log('Current URL:', url);
  });

  test('Navigate with different wait conditions', async ({ page }) => {
    // Wait until load event is fired (default)
    await page.goto('https://playwright.dev/', { waitUntil: 'load' });

    // Wait until there are no network connections for 500ms
    await page.goto('https://playwright.dev/', { waitUntil: 'networkidle' });

    // Wait until DOMContentLoaded event
    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });

    // Wait until the page is committed (earliest)
    await page.goto('https://playwright.dev/', { waitUntil: 'commit' });
  });

  test('Browser history navigation', async ({ page }) => {
    // Navigate to first page
    await page.goto('https://playwright.dev/');

    // Navigate to second page
    await page.goto('https://demo.playwright.dev/todomvc');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/playwright.dev/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/todomvc/);
  });

  test('Reload page', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Reload the page
    await page.reload();

    // Reload with cache bypass
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Navigate with timeout', async ({ page }) => {
    // Set custom timeout for navigation
    await page.goto('https://playwright.dev/', { timeout: 30000 });
  });

  test('Get page metadata', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Get page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Get page URL
    console.log('Page URL:', page.url());

    // Get page content
    const content = await page.content();
    console.log('Page HTML length:', content.length);
  });
});
