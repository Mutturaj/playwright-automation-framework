import { test, expect } from '@playwright/test';

/**
 * Screenshots and Visual Testing
 * Important for SDET Interviews - Reporting & Evidence
 */

test.describe('Page Screenshots', () => {

  test('Take full page screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Take full page screenshot
    await page.screenshot({
      path: 'screenshots/full-page.png',
      fullPage: true
    });

    console.log('Full page screenshot saved');
  });

  test('Take viewport screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Take screenshot of visible viewport only
    await page.screenshot({
      path: 'screenshots/viewport.png',
      fullPage: false  // default
    });

    console.log('Viewport screenshot saved');
  });

  test('Take screenshot with custom name using timestamp', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await page.screenshot({
      path: `screenshots/page-${timestamp}.png`
    });

    console.log('Screenshot with timestamp saved');
  });

  test('Take screenshot without saving to file', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Get screenshot as buffer (useful for custom processing)
    const buffer = await page.screenshot();

    console.log('Screenshot captured as buffer, size:', buffer.length);
    expect(buffer.length).toBeGreaterThan(0);
  });
});

test.describe('Element Screenshots', () => {

  test('Take screenshot of specific element', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Screenshot of specific element
    const header = page.locator('nav').first();
    await header.screenshot({
      path: 'screenshots/header-element.png'
    });

    console.log('Element screenshot saved');
  });

  test('Screenshot of form element', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form id="loginForm" style="padding: 20px; border: 1px solid #ccc; width: 300px;">
            <h3>Login Form</h3>
            <input type="text" placeholder="Username" style="display: block; margin: 10px 0; padding: 5px; width: 100%;">
            <input type="password" placeholder="Password" style="display: block; margin: 10px 0; padding: 5px; width: 100%;">
            <button type="submit" style="padding: 10px 20px;">Login</button>
          </form>
        </body>
      </html>
    `);

    // Screenshot of the form
    await page.locator('#loginForm').screenshot({
      path: 'screenshots/login-form.png'
    });

    console.log('Form screenshot saved');
  });

  test('Screenshot multiple elements', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    await page.locator('.new-todo').fill('Task 1');
    await page.locator('.new-todo').press('Enter');
    await page.locator('.new-todo').fill('Task 2');
    await page.locator('.new-todo').press('Enter');

    // Screenshot of header
    await page.locator('header').screenshot({
      path: 'screenshots/header.png'
    });

    // Screenshot of todo list
    await page.locator('.todo-list').screenshot({
      path: 'screenshots/todo-list.png'
    });

    console.log('Multiple element screenshots saved');
  });
});

test.describe('Screenshot Options', () => {

  test('Screenshot with clip (specific area)', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Capture specific area by coordinates
    await page.screenshot({
      path: 'screenshots/clipped-area.png',
      clip: {
        x: 0,
        y: 0,
        width: 500,
        height: 500
      }
    });

    console.log('Clipped screenshot saved');
  });

  test('Screenshot with quality settings (JPEG)', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Save as JPEG with quality setting
    await page.screenshot({
      path: 'screenshots/page-quality.jpeg',
      type: 'jpeg',
      quality: 80  // 0-100, only for JPEG
    });

    console.log('JPEG screenshot with quality 80 saved');
  });

  test('Screenshot with different formats', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // PNG (default, lossless)
    await page.screenshot({
      path: 'screenshots/page.png',
      type: 'png'
    });

    // JPEG (lossy, smaller file size)
    await page.screenshot({
      path: 'screenshots/page.jpeg',
      type: 'jpeg',
      quality: 90
    });

    console.log('Screenshots in different formats saved');
  });

  test('Screenshot with omitted background', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Screenshot with transparent background
    await page.screenshot({
      path: 'screenshots/transparent-bg.png',
      omitBackground: true  // Hides default white background
    });

    console.log('Screenshot with transparent background saved');
  });
});

test.describe('Screenshot in Test Lifecycle', () => {

  test('Take screenshots on test failure', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    try {
      // Intentional failure for demo
      await expect(page.locator('#nonExistent')).toBeVisible({ timeout: 2000 });
    } catch (error) {
      // Take screenshot on failure
      await page.screenshot({
        path: `screenshots/failure-${Date.now()}.png`,
        fullPage: true
      });
      console.log('Failure screenshot captured');
    }
  });

  test('Screenshot before and after action', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Before screenshot
    await page.screenshot({ path: 'screenshots/before-action.png' });

    // Perform action
    await page.locator('.new-todo').fill('New Task');
    await page.locator('.new-todo').press('Enter');

    // After screenshot
    await page.screenshot({ path: 'screenshots/after-action.png' });

    console.log('Before and after screenshots saved');
  });
});

test.describe('Visual Comparison (Visual Regression)', () => {

  test('Visual comparison using toHaveScreenshot', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // First run: creates baseline screenshot
    // Subsequent runs: compares against baseline
    await expect(page).toHaveScreenshot('todomvc-homepage.png', {
      maxDiffPixels: 100  // Allow up to 100 pixels difference
    });
  });

  test('Element visual comparison', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="card" style="padding: 20px; background: #f0f0f0; border: 2px solid #333; width: 200px;">
            <h3>Product Card</h3>
            <p>Price: $99.99</p>
            <button>Buy Now</button>
          </div>
        </body>
      </html>
    `);

    // Visual comparison of specific element
    await expect(page.locator('#card')).toHaveScreenshot('product-card.png');
  });

  test('Visual comparison with threshold', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Allow small visual differences
    await expect(page).toHaveScreenshot('todomvc-with-threshold.png', {
      maxDiffPixelRatio: 0.01,  // 1% difference allowed
      threshold: 0.2             // Color difference threshold (0-1)
    });
  });
});

test.describe('Real-World Screenshot Scenarios', () => {

  test('Screenshot test report with multiple captures', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Step 1: Initial state
    await page.screenshot({ path: 'screenshots/report/01-initial-state.png' });

    // Step 2: Add first todo
    await page.locator('.new-todo').fill('First Task');
    await page.locator('.new-todo').press('Enter');
    await page.screenshot({ path: 'screenshots/report/02-first-task-added.png' });

    // Step 3: Add second todo
    await page.locator('.new-todo').fill('Second Task');
    await page.locator('.new-todo').press('Enter');
    await page.screenshot({ path: 'screenshots/report/03-second-task-added.png' });

    // Step 4: Complete first task
    await page.locator('.todo-list li').first().locator('.toggle').check();
    await page.screenshot({ path: 'screenshots/report/04-task-completed.png' });

    console.log('Test report screenshots saved in screenshots/report/');
  });

  test('Screenshot of error message', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form id="loginForm">
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button type="submit">Login</button>
            <div id="error" style="color: red; display: none;">Invalid credentials</div>
          </form>
          <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
              e.preventDefault();
              document.getElementById('error').style.display = 'block';
            });
          </script>
        </body>
      </html>
    `);

    // Submit form to trigger error
    await page.locator('button[type="submit"]').click();

    // Wait for error message
    await page.locator('#error').waitFor({ state: 'visible' });

    // Screenshot of error state
    await page.screenshot({ path: 'screenshots/error-message.png' });

    // Screenshot of just the error element
    await page.locator('#error').screenshot({ path: 'screenshots/error-element.png' });

    console.log('Error screenshots saved');
  });

  test('Screenshot comparison across different states', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="themeToggle">Toggle Theme</button>
          <div id="content" style="padding: 20px; background: white; color: black;">
            <h1>Content Area</h1>
            <p>This is some content that changes with theme.</p>
          </div>
          <script>
            let darkMode = false;
            document.getElementById('themeToggle').addEventListener('click', function() {
              darkMode = !darkMode;
              const content = document.getElementById('content');
              if (darkMode) {
                content.style.background = '#333';
                content.style.color = 'white';
              } else {
                content.style.background = 'white';
                content.style.color = 'black';
              }
            });
          </script>
        </body>
      </html>
    `);

    // Light theme screenshot
    await page.locator('#content').screenshot({
      path: 'screenshots/theme-light.png'
    });

    // Toggle to dark theme
    await page.locator('#themeToggle').click();

    // Dark theme screenshot
    await page.locator('#content').screenshot({
      path: 'screenshots/theme-dark.png'
    });

    console.log('Theme comparison screenshots saved');
  });
});

test.describe('Mobile Screenshot', () => {

  test('Screenshot with mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('https://playwright.dev/');

    await page.screenshot({
      path: 'screenshots/mobile-view.png',
      fullPage: true
    });

    console.log('Mobile screenshot saved');
  });

  test('Screenshot with different device emulation', async ({ browser }) => {
    const context = await browser.newContext({
      ...require('@playwright/test').devices['iPhone 13 Pro']
    });

    const page = await context.newPage();
    await page.goto('https://playwright.dev/');

    await page.screenshot({
      path: 'screenshots/iphone13-view.png',
      fullPage: true
    });

    await context.close();

    console.log('iPhone 13 Pro emulation screenshot saved');
  });
});
