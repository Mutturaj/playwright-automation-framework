import { test, expect } from '@playwright/test';

/**
 * Handling Multiple Tabs and Windows in Playwright
 * IMPORTANT SDET Interview Topic ⭐⭐
 * Learn how to switch between tabs, open new windows, and manage multiple contexts
 */

test.describe('Open New Tab/Window', () => {

  test('Open link in new tab', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Main Page</h1>
          <a href="https://playwright.dev/" target="_blank" id="newTabLink">
            Open in New Tab
          </a>
        </body>
      </html>
    `);

    // Wait for new page (tab) to open when clicking link
    const pagePromise = context.waitForEvent('page');
    await page.locator('#newTabLink').click();
    const newPage = await pagePromise;

    // Wait for the new page to load
    await newPage.waitForLoadState();

    // Verify new page
    await expect(newPage).toHaveURL(/playwright.dev/);
    console.log('New tab URL:', newPage.url());

    // Close the new tab
    await newPage.close();
  });

  test('Open new tab programmatically', async ({ context }) => {
    // Create a new tab
    const newTab = await context.newPage();
    await newTab.goto('https://playwright.dev/');

    await expect(newTab).toHaveTitle(/Playwright/);
    console.log('New tab opened:', newTab.url());

    // Close the tab
    await newTab.close();
  });

  test('Open popup window', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="window.open('https://playwright.dev/', '_blank', 'width=600,height=400')">
            Open Popup
          </button>
        </body>
      </html>
    `);

    // Wait for popup window
    const popupPromise = context.waitForEvent('page');
    await page.locator('button').click();
    const popup = await popupPromise;

    await popup.waitForLoadState();

    // Verify popup
    await expect(popup).toHaveURL(/playwright.dev/);
    console.log('Popup opened');

    await popup.close();
  });
});

test.describe('Switch Between Tabs', () => {

  test('Switch between two tabs', async ({ page, context }) => {
    // First tab (main page)
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('Tab 1 URL:', page.url());

    // Open second tab
    const tab2 = await context.newPage();
    await tab2.goto('https://playwright.dev/');
    console.log('Tab 2 URL:', tab2.url());

    // Work on tab 2
    await expect(tab2).toHaveTitle(/Playwright/);
    console.log('Working on tab 2');

    // Switch back to tab 1 (original page)
    await expect(page).toHaveTitle(/TodoMVC/);
    console.log('Switched back to tab 1');

    // You can work on either page at any time
    await page.locator('.new-todo').fill('Task from main tab');
    await tab2.locator('nav a').first().click();

    // Close tabs
    await tab2.close();
  });

  test('Get all open pages and switch between them', async ({ page, context }) => {
    // Open multiple tabs
    await page.goto('https://demo.playwright.dev/todomvc');

    const tab2 = await context.newPage();
    await tab2.goto('https://playwright.dev/');

    const tab3 = await context.newPage();
    await tab3.goto('https://github.com/');

    // Get all pages
    const allPages = context.pages();
    console.log('Total open tabs:', allPages.length);

    // Iterate through all tabs
    for (let i = 0; i < allPages.length; i++) {
      const currentPage = allPages[i];
      console.log(`Tab ${i + 1} URL:`, currentPage.url());
      console.log(`Tab ${i + 1} Title:`, await currentPage.title());
    }

    // Work with specific tab by index
    const firstTab = allPages[0];
    await expect(firstTab).toHaveURL(/todomvc/);

    const secondTab = allPages[1];
    await expect(secondTab).toHaveURL(/playwright/);

    const thirdTab = allPages[2];
    await expect(thirdTab).toHaveURL(/github/);

    // Close specific tabs
    await tab2.close();
    await tab3.close();
  });

  test('Switch to tab by URL', async ({ page, context }) => {
    // Open multiple tabs
    await page.goto('https://demo.playwright.dev/todomvc');

    const tab2 = await context.newPage();
    await tab2.goto('https://playwright.dev/');

    const tab3 = await context.newPage();
    await tab3.goto('https://github.com/');

    // Find tab by URL
    const allPages = context.pages();
    const githubTab = allPages.find(p => p.url().includes('github'));

    if (githubTab) {
      console.log('Found GitHub tab');
      await githubTab.bringToFront(); // Bring tab to front
      // Perform actions on GitHub tab
      await expect(githubTab).toHaveURL(/github/);
    }

    // Clean up
    await tab2.close();
    await tab3.close();
  });

  test('Switch to tab by title', async ({ page, context }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const tab2 = await context.newPage();
    await tab2.goto('https://playwright.dev/');

    // Wait for pages to load
    await page.waitForLoadState('domcontentloaded');
    await tab2.waitForLoadState('domcontentloaded');

    // Find tab by title
    const allPages = context.pages();

    for (const p of allPages) {
      const title = await p.title();
      console.log('Tab title:', title);

      if (title.includes('Playwright')) {
        console.log('Found Playwright tab');
        await p.bringToFront();
        // Work with this tab
        await expect(p).toHaveTitle(/Playwright/);
      }
    }

    await tab2.close();
  });
});

test.describe('Handle Multiple Windows', () => {

  test('Work with parent and child windows', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Parent Window</h1>
          <button id="openChild" onclick="window.open('about:blank', 'childWindow')">
            Open Child Window
          </button>
        </body>
      </html>
    `);

    // Open child window
    const [childWindow] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#openChild').click()
    ]);

    await childWindow.waitForLoadState();

    // Set content in child window
    await childWindow.setContent(`
      <html>
        <body>
          <h1>Child Window</h1>
          <p>This is the child window content</p>
        </body>
      </html>
    `);

    // Verify parent window
    await expect(page.locator('h1')).toHaveText('Parent Window');
    console.log('Parent window verified');

    // Verify child window
    await expect(childWindow.locator('h1')).toHaveText('Child Window');
    console.log('Child window verified');

    // Close child window
    await childWindow.close();

    // Parent window still accessible
    await expect(page.locator('h1')).toHaveText('Parent Window');
  });

  test('Handle multiple popup windows', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="popup1" onclick="window.open('about:blank', 'popup1')">Popup 1</button>
          <button id="popup2" onclick="window.open('about:blank', 'popup2')">Popup 2</button>
          <button id="popup3" onclick="window.open('about:blank', 'popup3')">Popup 3</button>
        </body>
      </html>
    `);

    // Open multiple popups
    const popup1Promise = context.waitForEvent('page');
    await page.locator('#popup1').click();
    const popup1 = await popup1Promise;

    const popup2Promise = context.waitForEvent('page');
    await page.locator('#popup2').click();
    const popup2 = await popup2Promise;

    const popup3Promise = context.waitForEvent('page');
    await page.locator('#popup3').click();
    const popup3 = await popup3Promise;

    // Wait for all popups to load
    await Promise.all([
      popup1.waitForLoadState(),
      popup2.waitForLoadState(),
      popup3.waitForLoadState()
    ]);

    // Set content in each popup
    await popup1.setContent('<h1>Popup 1</h1>');
    await popup2.setContent('<h1>Popup 2</h1>');
    await popup3.setContent('<h1>Popup 3</h1>');

    // Verify each popup
    await expect(popup1.locator('h1')).toHaveText('Popup 1');
    await expect(popup2.locator('h1')).toHaveText('Popup 2');
    await expect(popup3.locator('h1')).toHaveText('Popup 3');

    console.log('All popups verified');

    // Close all popups
    await popup1.close();
    await popup2.close();
    await popup3.close();
  });
});

test.describe('Close Tabs and Windows', () => {

  test('Close specific tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');

    // Open second tab
    const tab2 = await context.newPage();
    await tab2.goto('https://demo.playwright.dev/todomvc');

    console.log('Total tabs before close:', context.pages().length);

    // Close second tab
    await tab2.close();

    console.log('Total tabs after close:', context.pages().length);
    expect(context.pages().length).toBe(1);

    // First tab still accessible
    await expect(page).toHaveURL(/playwright.dev/);
  });

  test('Close all tabs except main', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');

    // Open multiple tabs
    const tab2 = await context.newPage();
    await tab2.goto('https://github.com/');

    const tab3 = await context.newPage();
    await tab3.goto('https://google.com/');

    console.log('Total tabs:', context.pages().length);

    // Close all pages except the main one
    const allPages = context.pages();
    for (const p of allPages) {
      if (p !== page) {
        await p.close();
      }
    }

    console.log('Tabs after cleanup:', context.pages().length);
    expect(context.pages().length).toBe(1);
  });

  test('Detect when tab is closed', async ({ page, context }) => {
    const newTab = await context.newPage();
    await newTab.goto('https://playwright.dev/');

    let tabClosed = false;

    newTab.on('close', () => {
      tabClosed = true;
      console.log('Tab was closed');
    });

    await newTab.close();

    expect(tabClosed).toBe(true);
  });
});

test.describe('Real-World Scenarios', () => {

  test('Login in new tab and return to main tab', async ({ page, context }) => {
    // Main page
    await page.setContent(`
      <html>
        <body>
          <h1>Main Application</h1>
          <a href="#" target="_blank" id="loginLink">Login in New Tab</a>
          <div id="status">Not logged in</div>
        </body>
      </html>
    `);

    // Open login in new tab
    const loginTabPromise = context.waitForEvent('page');
    await page.locator('#loginLink').click();
    const loginTab = await loginTabPromise;

    await loginTab.waitForLoadState();

    // Perform login in new tab
    await loginTab.setContent(`
      <html>
        <body>
          <h1>Login Page</h1>
          <form id="loginForm">
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);

    await loginTab.locator('#username').fill('testuser');
    await loginTab.locator('#password').fill('password123');
    await loginTab.locator('button[type="submit"]').click();

    console.log('Login completed in new tab');

    // Close login tab
    await loginTab.close();

    // Return to main tab and update status
    await page.evaluate(() => {
      document.getElementById('status')!.textContent = 'Logged in';
    });

    await expect(page.locator('#status')).toHaveText('Logged in');
    console.log('Returned to main tab, status updated');
  });

  test('Compare products in multiple tabs', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Product Comparison</h1>
          <div class="product" data-id="1">
            <h3>Product 1</h3>
            <button class="compare">Compare in New Tab</button>
          </div>
          <div class="product" data-id="2">
            <h3>Product 2</h3>
            <button class="compare">Compare in New Tab</button>
          </div>
          <div class="product" data-id="3">
            <h3>Product 3</h3>
            <button class="compare">Compare in New Tab</button>
          </div>
        </body>
      </html>
    `);

    // Open products in multiple tabs
    const product1TabPromise = context.waitForEvent('page');
    await page.locator('.product[data-id="1"] button').click();
    const product1Tab = await product1TabPromise;

    const product2TabPromise = context.waitForEvent('page');
    await page.locator('.product[data-id="2"] button').click();
    const product2Tab = await product2TabPromise;

    // Wait for tabs to load
    await Promise.all([
      product1Tab.waitForLoadState(),
      product2Tab.waitForLoadState()
    ]);

    // Set content for product tabs
    await product1Tab.setContent('<h1>Product 1 Details</h1><p>Price: $99</p>');
    await product2Tab.setContent('<h1>Product 2 Details</h1><p>Price: $149</p>');

    // Verify both tabs
    await expect(product1Tab.locator('h1')).toHaveText('Product 1 Details');
    await expect(product2Tab.locator('h1')).toHaveText('Product 2 Details');

    console.log('Comparing products in multiple tabs');

    // Extract prices from both tabs
    const price1 = await product1Tab.locator('p').textContent();
    const price2 = await product2Tab.locator('p').textContent();

    console.log('Product 1:', price1);
    console.log('Product 2:', price2);

    // Close product tabs
    await product1Tab.close();
    await product2Tab.close();

    // Main page still accessible
    await expect(page.locator('h1')).toHaveText('Product Comparison');
  });

  test('Handle external link opening in new tab', async ({ page, context }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Some pages have external links that open in new tabs
    // This example shows how to handle them

    // If a link with target="_blank" exists, handle new page
    const externalLinkExists = await page.locator('a[target="_blank"]').count();

    if (externalLinkExists > 0) {
      const newPagePromise = context.waitForEvent('page');
      await page.locator('a[target="_blank"]').first().click();
      const newPage = await newPagePromise;

      await newPage.waitForLoadState();
      console.log('External link opened in new tab:', newPage.url());

      await newPage.close();
    } else {
      console.log('No external links found');
    }
  });

  test('Download in new tab scenario', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Reports Dashboard</h1>
          <button id="viewReport" onclick="window.open('/report.html', '_blank')">
            View Report in New Tab
          </button>
        </body>
      </html>
    `);

    // Open report in new tab
    const reportTabPromise = context.waitForEvent('page');
    await page.locator('#viewReport').click();
    const reportTab = await reportTabPromise;

    await reportTab.waitForLoadState();

    // Simulate report page
    await reportTab.setContent(`
      <html>
        <body>
          <h1>Monthly Report</h1>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Sales</td><td>$50,000</td></tr>
            <tr><td>Orders</td><td>1,234</td></tr>
          </table>
          <button id="downloadReport">Download PDF</button>
        </body>
      </html>
    `);

    // Verify report content
    await expect(reportTab.locator('h1')).toHaveText('Monthly Report');
    console.log('Report opened in new tab');

    // Click download button (in real scenario, this would trigger download)
    await reportTab.locator('#downloadReport').click();

    // Close report tab
    await reportTab.close();

    // Back to dashboard
    await expect(page.locator('h1')).toHaveText('Reports Dashboard');
  });
});

test.describe('Advanced Tab Management', () => {

  test('Keep track of tab references', async ({ page, context }) => {
    const tabs: { [key: string]: any } = {
      main: page
    };

    await tabs.main.goto('https://playwright.dev/');

    // Open and track tabs
    tabs.docs = await context.newPage();
    await tabs.docs.goto('https://playwright.dev/docs/intro');

    tabs.api = await context.newPage();
    await tabs.api.goto('https://playwright.dev/docs/api/class-playwright');

    // Work with tracked tabs
    await expect(tabs.main).toHaveURL(/playwright.dev$/);
    await expect(tabs.docs).toHaveURL(/.*docs\/intro/);
    await expect(tabs.api).toHaveURL(/.*api/);

    console.log('All tracked tabs verified');

    // Close specific tracked tabs
    await tabs.docs.close();
    await tabs.api.close();
  });

  test('Switch focus between tabs', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');

    const tab2 = await context.newPage();
    await tab2.goto('https://github.com/');

    // Bring tab to front (focus)
    await page.bringToFront();
    console.log('Focused on main tab');

    await tab2.bringToFront();
    console.log('Focused on second tab');

    // The focused tab receives keyboard events, scroll events, etc.

    await tab2.close();
  });

  test('Get tab count and validate', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');

    expect(context.pages().length).toBe(1);

    // Open more tabs
    const tab2 = await context.newPage();
    const tab3 = await context.newPage();

    expect(context.pages().length).toBe(3);
    console.log('Total tabs:', context.pages().length);

    // Close tabs
    await tab2.close();
    expect(context.pages().length).toBe(2);

    await tab3.close();
    expect(context.pages().length).toBe(1);
  });
});

test.describe('Best Practices & Common Patterns', () => {

  test('Pattern: Wait for new tab and handle it', async ({ page, context }) => {
    await page.setContent(`
      <html>
        <body>
          <a href="https://playwright.dev/" target="_blank">Open Link</a>
        </body>
      </html>
    `);

    // Best practice: Set up listener BEFORE clicking
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a').click()
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/playwright.dev/);

    await newPage.close();
  });

  test('Pattern: Handle multiple tabs with async operations', async ({ page, context }) => {
    await page.goto('https://playwright.dev/');

    // Open multiple tabs
    const tabs = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);

    // Navigate all tabs in parallel
    await Promise.all([
      tabs[0].goto('https://github.com/'),
      tabs[1].goto('https://google.com/'),
      tabs[2].goto('https://stackoverflow.com/')
    ]);

    console.log('All tabs loaded');

    // Close all tabs
    await Promise.all(tabs.map(tab => tab.close()));
  });

  test('Pattern: Clean up tabs in afterEach', async ({ page, context }) => {
    // Open multiple tabs during test
    const tab2 = await context.newPage();
    await tab2.goto('https://playwright.dev/');

    const tab3 = await context.newPage();
    await tab3.goto('https://github.com/');

    // Test logic here...

    // Manual cleanup (or use afterEach hook)
    const allPages = context.pages();
    for (const p of allPages) {
      if (p !== page) {
        await p.close();
      }
    }

    expect(context.pages().length).toBe(1);
  });
});

/**
 * KEY INTERVIEW POINTS:
 *
 * 1. How to open new tab/window?
 *    - context.newPage() - programmatically
 *    - context.waitForEvent('page') - when clicked
 *
 * 2. How to switch between tabs?
 *    - Just use the page reference (no explicit switch needed!)
 *    - page.bringToFront() - to focus a tab
 *
 * 3. How to close tabs?
 *    - page.close() - close specific tab
 *    - Loop through context.pages() to close multiple
 *
 * 4. How to get all open tabs?
 *    - context.pages() - returns array of all pages
 *
 * 5. Best Practices:
 *    - Always wait for new page to load: await newPage.waitForLoadState()
 *    - Set up listener BEFORE clicking: context.waitForEvent('page')
 *    - Clean up tabs after test to avoid memory leaks
 *    - Keep references to tabs you need to work with
 */
