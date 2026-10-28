import { test, expect } from '@playwright/test';

/**
 * Handling Dialogs, Alerts, Prompts, Confirms
 * Important SDET Interview Topic
 */

test.describe('Alert Dialogs', () => {

  test('Handle simple alert', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="alertBtn" onclick="alert('This is an alert!')">Show Alert</button>
        </body>
      </html>
    `);

    // Listen for dialog event
    page.on('dialog', async dialog => {
      console.log('Dialog type:', dialog.type());
      console.log('Dialog message:', dialog.message());

      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('This is an alert!');

      // Accept/dismiss the alert
      await dialog.accept();
    });

    // Click button that triggers alert
    await page.locator('#alertBtn').click();

    console.log('Alert handled successfully');
  });

  test('Alert with page.once for single dialog', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="alert('One-time alert')">Click Me</button>
        </body>
      </html>
    `);

    // Handle dialog only once
    page.once('dialog', async dialog => {
      console.log('Handling alert:', dialog.message());
      await dialog.accept();
    });

    await page.locator('button').click();
  });
});

test.describe('Confirm Dialogs', () => {

  test('Accept confirm dialog', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="confirmBtn" onclick="handleConfirm()">Show Confirm</button>
          <div id="result"></div>
          <script>
            function handleConfirm() {
              const result = confirm('Are you sure?');
              document.getElementById('result').textContent = result ? 'Accepted' : 'Cancelled';
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('Confirm message:', dialog.message());
      expect(dialog.type()).toBe('confirm');

      // Accept the confirm dialog
      await dialog.accept();
    });

    await page.locator('#confirmBtn').click();

    // Verify result
    await expect(page.locator('#result')).toHaveText('Accepted');
    console.log('Confirm dialog accepted');
  });

  test('Dismiss/Cancel confirm dialog', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="confirmBtn" onclick="handleConfirm()">Show Confirm</button>
          <div id="result"></div>
          <script>
            function handleConfirm() {
              const result = confirm('Do you want to proceed?');
              document.getElementById('result').textContent = result ? 'Proceeded' : 'Cancelled';
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('Dismissing confirm dialog');

      // Dismiss/Cancel the confirm dialog
      await dialog.dismiss();
    });

    await page.locator('#confirmBtn').click();

    // Verify result shows cancelled
    await expect(page.locator('#result')).toHaveText('Cancelled');
    console.log('Confirm dialog dismissed');
  });
});

test.describe('Prompt Dialogs', () => {

  test('Accept prompt with input', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="promptBtn" onclick="handlePrompt()">Show Prompt</button>
          <div id="result"></div>
          <script>
            function handlePrompt() {
              const name = prompt('What is your name?', 'Default Name');
              document.getElementById('result').textContent = name ? 'Hello, ' + name : 'No name provided';
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('Prompt message:', dialog.message());
      console.log('Default value:', dialog.defaultValue());

      expect(dialog.type()).toBe('prompt');

      // Accept prompt with custom input
      await dialog.accept('John Doe');
    });

    await page.locator('#promptBtn').click();

    // Verify result
    await expect(page.locator('#result')).toHaveText('Hello, John Doe');
    console.log('Prompt accepted with input');
  });

  test('Dismiss prompt', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="promptBtn" onclick="handlePrompt()">Show Prompt</button>
          <div id="result"></div>
          <script>
            function handlePrompt() {
              const age = prompt('How old are you?');
              document.getElementById('result').textContent = age ? 'Age: ' + age : 'Age not provided';
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('Dismissing prompt');

      // Dismiss prompt (user clicks Cancel)
      await dialog.dismiss();
    });

    await page.locator('#promptBtn').click();

    await expect(page.locator('#result')).toHaveText('Age not provided');
    console.log('Prompt dismissed');
  });

  test('Prompt with empty input', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="handlePrompt()">Ask Question</button>
          <div id="answer"></div>
          <script>
            function handlePrompt() {
              const response = prompt('Enter your answer:');
              document.getElementById('answer').textContent = response || 'Empty response';
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      // Accept with empty string
      await dialog.accept('');
    });

    await page.locator('button').click();

    await expect(page.locator('#answer')).toHaveText('Empty response');
  });
});

test.describe('beforeunload Dialogs', () => {

  test('Handle page unload dialog', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Page with unload handler</h1>
          <a href="https://playwright.dev" id="leaveLink">Leave Page</a>
          <script>
            window.addEventListener('beforeunload', function(e) {
              e.preventDefault();
              e.returnValue = '';
              return '';
            });
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('beforeunload dialog triggered');
      expect(dialog.type()).toBe('beforeunload');

      // Accept to proceed with navigation
      await dialog.accept();
    });

    await page.locator('#leaveLink').click();

    console.log('beforeunload dialog handled');
  });
});

test.describe('Multiple Dialogs', () => {

  test('Handle multiple dialogs in sequence', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="showMultipleDialogs()">Show Multiple Dialogs</button>
          <div id="result"></div>
          <script>
            function showMultipleDialogs() {
              alert('First alert');
              const confirmed = confirm('Do you confirm?');
              if (confirmed) {
                const name = prompt('Enter your name:');
                document.getElementById('result').textContent = 'Name: ' + name;
              }
            }
          </script>
        </body>
      </html>
    `);

    let dialogCount = 0;

    page.on('dialog', async dialog => {
      dialogCount++;
      console.log(`Dialog ${dialogCount}: ${dialog.type()} - ${dialog.message()}`);

      if (dialog.type() === 'alert') {
        await dialog.accept();
      } else if (dialog.type() === 'confirm') {
        await dialog.accept(); // Confirm yes
      } else if (dialog.type() === 'prompt') {
        await dialog.accept('Test User');
      }
    });

    await page.locator('button').click();

    // Wait a bit for all dialogs to complete
    await page.waitForTimeout(500);

    await expect(page.locator('#result')).toHaveText('Name: Test User');
    console.log(`Handled ${dialogCount} dialogs`);
  });
});

test.describe('Dialog Without Listener', () => {

  test('Auto-dismiss dialogs without listener', async ({ page }) => {
    // By default, Playwright auto-dismisses dialogs if no listener is set
    await page.setContent(`
      <html>
        <body>
          <button onclick="alert('Auto dismissed')">Show Alert</button>
          <div id="status">Ready</div>
          <script>
            document.querySelector('button').addEventListener('click', function() {
              alert('Auto dismissed');
              document.getElementById('status').textContent = 'After alert';
            });
          </script>
        </body>
      </html>
    `);

    // No dialog listener - Playwright auto-dismisses
    await page.locator('button').click();

    await expect(page.locator('#status')).toHaveText('After alert');
    console.log('Dialog auto-dismissed by Playwright');
  });
});

test.describe('Real-World Dialog Scenarios', () => {

  test('Delete confirmation dialog', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div class="item" id="item1">
            Item 1
            <button class="delete-btn" onclick="deleteItem(1)">Delete</button>
          </div>
          <div id="message"></div>
          <script>
            function deleteItem(id) {
              if (confirm('Are you sure you want to delete this item?')) {
                document.getElementById('item' + id).remove();
                document.getElementById('message').textContent = 'Item deleted';
              } else {
                document.getElementById('message').textContent = 'Deletion cancelled';
              }
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept(); // Confirm deletion
    });

    await page.locator('.delete-btn').click();

    await expect(page.locator('#message')).toHaveText('Item deleted');
    await expect(page.locator('#item1')).not.toBeVisible();

    console.log('Delete confirmation handled');
  });

  test('Form reset confirmation', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form id="myForm">
            <input type="text" id="name" value="John Doe">
            <input type="email" id="email" value="john@example.com">
            <button type="button" onclick="resetForm()">Reset Form</button>
          </form>
          <script>
            function resetForm() {
              if (confirm('Reset form? All data will be lost.')) {
                document.getElementById('myForm').reset();
              }
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      console.log('Reset confirmation:', dialog.message());
      await dialog.dismiss(); // Don't reset
    });

    await page.locator('button').click();

    // Form should still have values
    await expect(page.locator('#name')).toHaveValue('John Doe');
    await expect(page.locator('#email')).toHaveValue('john@example.com');

    console.log('Form reset cancelled via dialog');
  });

  test('User feedback prompt', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button onclick="getFeedback()">Give Feedback</button>
          <div id="feedback"></div>
          <script>
            function getFeedback() {
              const feedback = prompt('Please share your feedback:');
              if (feedback) {
                document.getElementById('feedback').textContent = 'Thank you for: ' + feedback;
              } else {
                document.getElementById('feedback').textContent = 'No feedback provided';
              }
            }
          </script>
        </body>
      </html>
    `);

    page.on('dialog', async dialog => {
      await dialog.accept('Great product! Very helpful.');
    });

    await page.locator('button').click();

    await expect(page.locator('#feedback')).toContain('Thank you for: Great product');

    console.log('Feedback prompt handled');
  });
});
