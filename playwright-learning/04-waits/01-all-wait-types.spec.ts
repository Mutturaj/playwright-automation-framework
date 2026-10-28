import { test, expect } from '@playwright/test';

/**
 * Different Types of Waits in Playwright
 * CRITICAL SDET Interview Topic - Most Asked!
 *
 * Playwright has built-in auto-waiting, but understanding explicit waits is essential
 */

test.describe('Auto-Waiting (Built-in)', () => {

  test('Playwright auto-waits for elements', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Playwright automatically waits for:
    // 1. Element to be attached to DOM
    // 2. Element to be visible
    // 3. Element to be stable (not animating)
    // 4. Element to receive events (not obscured)
    // 5. Element to be enabled

    await page.locator('.new-todo').fill('Auto-wait example');
    // No explicit wait needed - Playwright handles it!
  });
});

test.describe('waitForSelector - Wait for Element', () => {

  test('Wait for element to be visible', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="showBtn">Show Element</button>
          <div id="hiddenElement" style="display: none;">
            I will appear after 2 seconds
          </div>
          <script>
            document.getElementById('showBtn').addEventListener('click', function() {
              setTimeout(() => {
                document.getElementById('hiddenElement').style.display = 'block';
              }, 2000);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#showBtn').click();

    // Wait for element to be visible (default state: 'visible')
    await page.locator('#hiddenElement').waitFor({ state: 'visible' });

    await expect(page.locator('#hiddenElement')).toBeVisible();
  });

  test('Wait for element states', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.locator('.new-todo');

    // Wait for different states:
    await input.waitFor({ state: 'visible' });    // Default
    await input.waitFor({ state: 'attached' });   // Attached to DOM
    await input.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {}); // Will timeout since it's visible

    // Element is stable (not animating)
    await expect(input).toBeVisible();
  });

  test('Wait for element to be attached to DOM', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="addBtn">Add Element</button>
          <div id="container"></div>
          <script>
            document.getElementById('addBtn').addEventListener('click', function() {
              setTimeout(() => {
                const newDiv = document.createElement('div');
                newDiv.id = 'dynamicElement';
                newDiv.textContent = 'Dynamic Content';
                document.getElementById('container').appendChild(newDiv);
              }, 1500);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#addBtn').click();

    // Wait for element to be attached
    await page.locator('#dynamicElement').waitFor({ state: 'attached' });

    await expect(page.locator('#dynamicElement')).toBeVisible();
  });

  test('Wait for element to be hidden/detached', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="message">This will disappear</div>
          <button id="hideBtn">Hide Message</button>
          <script>
            document.getElementById('hideBtn').addEventListener('click', function() {
              setTimeout(() => {
                document.getElementById('message').style.display = 'none';
              }, 1000);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#hideBtn').click();

    // Wait for element to be hidden
    await page.locator('#message').waitFor({ state: 'hidden' });

    await expect(page.locator('#message')).not.toBeVisible();
  });
});

test.describe('waitForLoadState - Page Load States', () => {

  test('Wait for different page load states', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Wait for load event (default)
    await page.waitForLoadState('load');
    console.log('Page load event fired');

    // Wait for DOMContentLoaded
    await page.waitForLoadState('domcontentloaded');
    console.log('DOM content loaded');

    // Wait for network to be idle (no more than 2 network connections for 500ms)
    await page.waitForLoadState('networkidle');
    console.log('Network is idle');
  });

  test('Wait after navigation', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Navigate and wait for specific state
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle');

    console.log('Page fully loaded with network idle');
  });
});

test.describe('waitForURL - Wait for URL Change', () => {

  test('Wait for specific URL', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click a link that navigates
    await page.locator('nav a').first().click();

    // Wait for URL to change
    await page.waitForURL('**/docs/**');

    console.log('Navigated to docs page');
  });

  test('Wait for URL with regex', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Navigate
    await page.locator('text=Docs').first().click();

    // Wait for URL matching regex
    await page.waitForURL(/.*docs.*/);
  });

  test('Wait for URL with function', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Navigate
    await page.locator('text=API').first().click();

    // Wait for URL using function
    await page.waitForURL(url => url.pathname.includes('api'));
  });
});

test.describe('waitForResponse - Wait for Network Response', () => {

  test('Wait for specific API response', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Wait for API response
    const responsePromise = page.waitForResponse('**/api/v1/fruits');

    // Trigger the request
    await page.locator('button').click();

    const response = await responsePromise;
    console.log('API Response Status:', response.status());
    expect(response.ok()).toBeTruthy();
  });

  test('Wait for response with predicate', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Wait for response matching condition
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/') && response.status() === 200
    );

    await page.locator('button').click();

    const response = await responsePromise;
    console.log('Matched response:', response.url());
  });
});

test.describe('waitForRequest - Wait for Network Request', () => {

  test('Wait for specific request', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Wait for request
    const requestPromise = page.waitForRequest('**/api/v1/fruits');

    await page.locator('button').click();

    const request = await requestPromise;
    console.log('Request URL:', request.url());
    console.log('Request Method:', request.method());
  });
});

test.describe('waitForTimeout - Hard Wait (Not Recommended)', () => {

  test('Use waitForTimeout as last resort', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Hard wait - NOT RECOMMENDED (use only when necessary)
    // Better to use waitForSelector or waitForLoadState
    await page.waitForTimeout(2000); // Wait 2 seconds

    console.log('Waited for 2 seconds (avoid this in real tests)');
  });
});

test.describe('Custom Wait Conditions', () => {

  test('Wait for function - Custom condition', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="counter">0</div>
          <script>
            let count = 0;
            setInterval(() => {
              count++;
              document.getElementById('counter').textContent = count;
            }, 500);
          </script>
        </body>
      </html>
    `);

    // Wait for custom condition
    await page.waitForFunction(() => {
      const counter = document.getElementById('counter');
      return counter && parseInt(counter.textContent) >= 5;
    });

    const counterText = await page.locator('#counter').textContent();
    console.log('Counter reached:', counterText);
    expect(parseInt(counterText!)).toBeGreaterThanOrEqual(5);
  });

  test('Wait for function with polling', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="status">loading</div>
          <script>
            setTimeout(() => {
              document.getElementById('status').textContent = 'ready';
            }, 3000);
          </script>
        </body>
      </html>
    `);

    // Wait with custom polling interval
    await page.waitForFunction(
      () => document.getElementById('status')?.textContent === 'ready',
      { polling: 500, timeout: 5000 } // Check every 500ms, timeout after 5s
    );

    await expect(page.locator('#status')).toHaveText('ready');
  });

  test('Wait for element count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add multiple todos
    for (let i = 1; i <= 3; i++) {
      await page.locator('.new-todo').fill(`Task ${i}`);
      await page.locator('.new-todo').press('Enter');
    }

    // Wait for specific number of elements
    await page.waitForFunction(
      () => document.querySelectorAll('.todo-list li').length >= 3
    );

    const count = await page.locator('.todo-list li').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Real-World Wait Scenarios', () => {

  test('Wait for loading spinner to disappear', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="spinner" style="display: block;">Loading...</div>
          <div id="content" style="display: none;">Content Loaded!</div>
          <button id="loadBtn">Load Content</button>
          <script>
            document.getElementById('loadBtn').addEventListener('click', function() {
              document.getElementById('spinner').style.display = 'block';
              document.getElementById('content').style.display = 'none';

              setTimeout(() => {
                document.getElementById('spinner').style.display = 'none';
                document.getElementById('content').style.display = 'block';
              }, 2000);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#loadBtn').click();

    // Wait for spinner to disappear
    await page.locator('#spinner').waitFor({ state: 'hidden' });

    // Wait for content to appear
    await page.locator('#content').waitFor({ state: 'visible' });

    await expect(page.locator('#content')).toBeVisible();
    await expect(page.locator('#spinner')).not.toBeVisible();
  });

  test('Wait for data to load in table', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="loadData">Load Data</button>
          <table id="dataTable">
            <thead><tr><th>Name</th><th>Age</th></tr></thead>
            <tbody id="tableBody"></tbody>
          </table>
          <script>
            document.getElementById('loadData').addEventListener('click', function() {
              setTimeout(() => {
                const tbody = document.getElementById('tableBody');
                const data = [
                  { name: 'John', age: 30 },
                  { name: 'Jane', age: 25 },
                  { name: 'Bob', age: 35 }
                ];
                data.forEach(person => {
                  const row = tbody.insertRow();
                  row.insertCell(0).textContent = person.name;
                  row.insertCell(1).textContent = person.age;
                });
              }, 1500);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#loadData').click();

    // Wait for table rows to appear
    await page.locator('#tableBody tr').first().waitFor({ state: 'attached' });

    // Verify data loaded
    const rowCount = await page.locator('#tableBody tr').count();
    expect(rowCount).toBe(3);
  });

  test('Wait with timeout and error handling', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    try {
      // Try to wait for an element that doesn't exist
      await page.locator('#nonExistent').waitFor({ state: 'visible', timeout: 3000 });
    } catch (error) {
      console.log('Element not found within timeout - as expected');
    }

    // Test continues even if wait times out
    await expect(page.locator('.new-todo')).toBeVisible();
  });
});

test.describe('Best Practices Summary', () => {

  test('Recommended wait strategies', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // ✅ GOOD: Use Playwright's auto-waiting (built-in)
    await page.locator('.new-todo').fill('Good practice');

    // ✅ GOOD: Wait for specific element state
    await page.locator('.new-todo').waitFor({ state: 'visible' });

    // ✅ GOOD: Wait for network idle
    await page.waitForLoadState('networkidle');

    // ✅ GOOD: Use assertions (they auto-retry)
    await expect(page.locator('.new-todo')).toBeVisible();

    // ❌ BAD: Avoid hard waits when possible
    // await page.waitForTimeout(5000); // Try to avoid this

    console.log('✅ Use Playwright auto-waiting whenever possible!');
    console.log('✅ Use explicit waits only when needed!');
    console.log('❌ Avoid waitForTimeout unless absolutely necessary!');
  });
});
