import { test, expect } from '@playwright/test';

/**
 * User Interactions - Clicks and Typing
 * SDET Interview Topics:
 * - Click actions
 * - Text input
 * - Keyboard actions
 * - Mouse actions
 */

test.describe('Click Interactions', () => {

  test('Basic click actions', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Simple click
    const input = page.locator('.new-todo');
    await input.click();

    // Click with options
    await input.click({
      button: 'left',  // 'left', 'right', 'middle'
      clickCount: 1,   // Single click
    });
  });

  test('Double click and right click', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Double click
    await page.locator('.new-todo').dblclick();

    // Right click (context menu)
    await page.locator('.new-todo').click({ button: 'right' });
  });

  test('Click with modifiers', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click with Ctrl/Cmd key (opens in new tab)
    // await page.locator('a').first().click({ modifiers: ['Control'] });

    // Click with Shift
    // await page.locator('button').click({ modifiers: ['Shift'] });

    // Click with multiple modifiers
    // await page.locator('button').click({ modifiers: ['Control', 'Shift'] });
  });

  test('Click at specific position', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Click at specific coordinates relative to element
    await page.locator('.new-todo').click({ position: { x: 10, y: 10 } });
  });

  test('Force click (bypass actionability checks)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Force click even if element is not visible/ready
    // Use with caution - only when necessary
    await page.locator('.new-todo').click({ force: true });
  });
});

test.describe('Text Input Interactions', () => {

  test('Fill text input', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Fill (clears existing text first)
    await input.fill('Learn Playwright');
    await expect(input).toHaveValue('Learn Playwright');

    // Fill another value (replaces previous)
    await input.fill('Master Playwright');
    await expect(input).toHaveValue('Master Playwright');
  });

  test('Type text character by character', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Type simulates real user typing with delays
    await input.type('Learn Playwright', { delay: 100 }); // 100ms between keystrokes
  });

  test('Clear text input', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');
    await input.fill('Text to clear');

    // Clear the input
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('Press specific keys', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');
    await input.fill('Task 1');

    // Press Enter
    await input.press('Enter');

    // Other key examples:
    // await input.press('Tab');
    // await input.press('Escape');
    // await input.press('Backspace');
    // await input.press('Delete');
    // await input.press('ArrowDown');
  });

  test('Keyboard shortcuts', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');
    await input.fill('Select all text');

    // Ctrl+A (Select all)
    await input.press('Control+A');

    // Ctrl+C (Copy)
    await input.press('Control+C');

    // Ctrl+V (Paste)
    await input.press('Control+V');

    // Ctrl+X (Cut)
    // await input.press('Control+X');

    // Ctrl+Z (Undo)
    // await input.press('Control+Z');
  });

  test('Input special characters', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Special characters
    await input.fill('Email: test@example.com');
    await input.press('Enter');

    await input.fill('Price: $99.99');
    await input.press('Enter');

    await input.fill('Path: C:\\Users\\Test');
    await input.press('Enter');
  });

  test('Sequential input actions', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Multiple sequential actions
    await input.click();
    await input.type('First task');
    await page.keyboard.press('Enter');

    await input.type('Second task');
    await page.keyboard.press('Enter');

    await input.type('Third task');
    await page.keyboard.press('Enter');

    // Verify all tasks were added
    const taskCount = await page.locator('.todo-list li').count();
    expect(taskCount).toBe(3);
  });
});

test.describe('Advanced Interactions', () => {

  test('Hover action', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Hover over an element
    await page.locator('nav a').first().hover();

    // Hover and then click
    const link = page.locator('nav a').first();
    await link.hover();
    await link.click();
  });

  test('Drag and drop', async ({ page }) => {
    // Example with drag and drop
    // await page.goto('https://example.com/drag-drop');

    // Method 1: Using dragTo
    // await page.locator('#draggable').dragTo(page.locator('#droppable'));

    // Method 2: Using mouse actions
    // const source = page.locator('#draggable');
    // const target = page.locator('#droppable');
    // await source.hover();
    // await page.mouse.down();
    // await target.hover();
    // await page.mouse.up();
  });

  test('Focus on element', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Focus on element
    await input.focus();

    // Verify element is focused
    await expect(input).toBeFocused();
  });

  test('Blur (remove focus)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');
    await input.focus();

    // Remove focus
    await input.blur();
  });
});
