import { test, expect } from '@playwright/test';

/**
 * Checkboxes and Radio Buttons
 * SDET Interview Must-Know Topics
 */

test.describe('Checkbox Interactions', () => {

  test('Check and uncheck checkboxes', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add a todo item first
    await page.locator('.new-todo').fill('Complete checkbox example');
    await page.locator('.new-todo').press('Enter');

    // Locate the checkbox (toggle)
    const checkbox = page.locator('.todo-list li').first().locator('.toggle');

    // Check the checkbox
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck the checkbox
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('Check checkbox if not already checked', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    await page.locator('.new-todo').fill('Task to check');
    await page.locator('.new-todo').press('Enter');

    const checkbox = page.locator('.todo-list li').first().locator('.toggle');

    // Check only if not checked (idempotent)
    await checkbox.check();
    await checkbox.check(); // Won't fail if already checked
    await expect(checkbox).toBeChecked();
  });

  test('Verify checkbox state', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    await page.locator('.new-todo').fill('Verify checkbox state');
    await page.locator('.new-todo').press('Enter');

    const checkbox = page.locator('.todo-list li').first().locator('.toggle');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Get checked state programmatically
    const isChecked = await checkbox.isChecked();
    console.log('Checkbox is checked:', isChecked);
    expect(isChecked).toBe(true);
  });

  test('Work with multiple checkboxes', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add multiple todos
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Get all checkboxes
    const checkboxes = page.locator('.todo-list li .toggle');
    const count = await checkboxes.count();
    console.log('Total checkboxes:', count);

    // Check all checkboxes
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    // Verify all are checked
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });

  test('Toggle checkbox using click', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    await page.locator('.new-todo').fill('Toggle with click');
    await page.locator('.new-todo').press('Enter');

    const checkbox = page.locator('.todo-list li').first().locator('.toggle');

    // Toggle using click
    await checkbox.click(); // Checks it
    await expect(checkbox).toBeChecked();

    await checkbox.click(); // Unchecks it
    await expect(checkbox).not.toBeChecked();
  });
});

test.describe('Radio Button Interactions', () => {

  test('Select radio button', async ({ page }) => {
    // Create a test page with radio buttons
    await page.setContent(`
      <html>
        <body>
          <form>
            <h3>Select your experience level:</h3>
            <label>
              <input type="radio" name="experience" value="beginner" />
              Beginner
            </label>
            <label>
              <input type="radio" name="experience" value="intermediate" />
              Intermediate
            </label>
            <label>
              <input type="radio" name="experience" value="advanced" />
              Advanced
            </label>
          </form>
        </body>
      </html>
    `);

    // Select by value
    await page.locator('input[value="intermediate"]').check();
    await expect(page.locator('input[value="intermediate"]')).toBeChecked();

    // Verify others are not checked
    await expect(page.locator('input[value="beginner"]')).not.toBeChecked();
    await expect(page.locator('input[value="advanced"]')).not.toBeChecked();
  });

  test('Select radio button by label', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <label>
              <input type="radio" name="gender" value="male" id="male" />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" id="female" />
              Female
            </label>
            <label>
              <input type="radio" name="gender" value="other" id="other" />
              Other
            </label>
          </form>
        </body>
      </html>
    `);

    // Select using label
    await page.locator('#female').check();
    await expect(page.locator('#female')).toBeChecked();
  });

  test('Verify radio button group', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <h3>Select payment method:</h3>
            <input type="radio" name="payment" value="credit" id="credit" />
            <label for="credit">Credit Card</label>

            <input type="radio" name="payment" value="debit" id="debit" />
            <label for="debit">Debit Card</label>

            <input type="radio" name="payment" value="paypal" id="paypal" />
            <label for="paypal">PayPal</label>
          </form>
        </body>
      </html>
    `);

    // Get all radio buttons in the group
    const radioButtons = page.locator('input[name="payment"]');
    const count = await radioButtons.count();
    console.log('Total radio buttons:', count);
    expect(count).toBe(3);

    // Select one and verify only one is checked
    await page.locator('#credit').check();

    await expect(page.locator('#credit')).toBeChecked();
    await expect(page.locator('#debit')).not.toBeChecked();
    await expect(page.locator('#paypal')).not.toBeChecked();
  });

  test('Get selected radio button value', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <input type="radio" name="color" value="red" id="red" />
            <label for="red">Red</label>

            <input type="radio" name="color" value="blue" id="blue" />
            <label for="blue">Blue</label>

            <input type="radio" name="color" value="green" id="green" />
            <label for="green">Green</label>
          </form>
        </body>
      </html>
    `);

    await page.locator('#blue').check();

    // Get the value of checked radio button
    const selectedValue = await page.locator('input[name="color"]:checked').getAttribute('value');
    console.log('Selected color:', selectedValue);
    expect(selectedValue).toBe('blue');
  });

  test('Radio buttons are mutually exclusive', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <input type="radio" name="choice" value="yes" id="yes" />
            <label for="yes">Yes</label>

            <input type="radio" name="choice" value="no" id="no" />
            <label for="no">No</label>

            <input type="radio" name="choice" value="maybe" id="maybe" />
            <label for="maybe">Maybe</label>
          </form>
        </body>
      </html>
    `);

    // Select first option
    await page.locator('#yes').check();
    await expect(page.locator('#yes')).toBeChecked();

    // Select second option - first should be unchecked
    await page.locator('#no').check();
    await expect(page.locator('#no')).toBeChecked();
    await expect(page.locator('#yes')).not.toBeChecked();

    // Select third option - second should be unchecked
    await page.locator('#maybe').check();
    await expect(page.locator('#maybe')).toBeChecked();
    await expect(page.locator('#no')).not.toBeChecked();
  });
});

test.describe('Real-World Scenarios', () => {

  test('Form with checkboxes and radio buttons', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <form>
            <h3>User Preferences</h3>

            <div>
              <h4>Account Type:</h4>
              <input type="radio" name="accountType" value="personal" id="personal" />
              <label for="personal">Personal</label>

              <input type="radio" name="accountType" value="business" id="business" />
              <label for="business">Business</label>
            </div>

            <div>
              <h4>Notifications:</h4>
              <input type="checkbox" name="emailNotif" id="emailNotif" />
              <label for="emailNotif">Email Notifications</label>

              <input type="checkbox" name="smsNotif" id="smsNotif" />
              <label for="smsNotif">SMS Notifications</label>

              <input type="checkbox" name="pushNotif" id="pushNotif" />
              <label for="pushNotif">Push Notifications</label>
            </div>

            <div>
              <input type="checkbox" name="terms" id="terms" />
              <label for="terms">I agree to terms and conditions</label>
            </div>

            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `);

    // Select account type
    await page.locator('#business').check();

    // Select notification preferences
    await page.locator('#emailNotif').check();
    await page.locator('#pushNotif').check();
    // Leave SMS unchecked

    // Accept terms
    await page.locator('#terms').check();

    // Verify selections
    await expect(page.locator('#business')).toBeChecked();
    await expect(page.locator('#emailNotif')).toBeChecked();
    await expect(page.locator('#smsNotif')).not.toBeChecked();
    await expect(page.locator('#pushNotif')).toBeChecked();
    await expect(page.locator('#terms')).toBeChecked();

    console.log('Form filled successfully!');
  });
});
