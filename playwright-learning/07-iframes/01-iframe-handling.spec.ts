import { test, expect } from '@playwright/test';

/**
 * IFrame Handling in Playwright
 * Important SDET Interview Topic - Working with embedded frames
 */

test.describe('Basic IFrame Operations', () => {

  test('Locate and interact with iframe by name', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Main Page</h1>
          <iframe name="myFrame" src="data:text/html,<html><body><h2>Inside IFrame</h2><button id='iframeBtn'>Click Me</button></body></html>"></iframe>
        </body>
      </html>
    `);

    // Get frame by name
    const frame = page.frame({ name: 'myFrame' });
    expect(frame).not.toBeNull();

    // Interact with element inside iframe
    await frame!.locator('#iframeBtn').click();

    console.log('Clicked button inside iframe');
  });

  test('Locate iframe by URL', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <iframe src="data:text/html,<html><body><h1 id='frameHeading'>Frame Content</h1></body></html>"></iframe>
        </body>
      </html>
    `);

    // Get frame by URL pattern
    const frame = page.frame({ url: /data:text\/html/ });
    expect(frame).not.toBeNull();

    // Verify content inside iframe
    await expect(frame!.locator('#frameHeading')).toHaveText('Frame Content');
  });

  test('Using frameLocator (recommended method)', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Parent Page</h1>
          <iframe id="testFrame" src="data:text/html,<html><body><input id='username' placeholder='Enter username'/><button id='submit'>Submit</button></body></html>"></iframe>
        </body>
      </html>
    `);

    // Use frameLocator (modern Playwright API)
    const frameLocator = page.frameLocator('#testFrame');

    // Interact with elements inside iframe
    await frameLocator.locator('#username').fill('testuser');
    await frameLocator.locator('#submit').click();

    console.log('Interacted with iframe using frameLocator');
  });
});

test.describe('Nested IFrames', () => {

  test('Handle nested iframes', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Main Page</h1>
          <iframe id="outerFrame" src="data:text/html,
            <html>
              <body>
                <h2>Outer IFrame</h2>
                <iframe id='innerFrame' src='data:text/html,<html><body><h3 id=nestedContent>Nested IFrame Content</h3></body></html>'></iframe>
              </body>
            </html>
          "></iframe>
        </body>
      </html>
    `);

    await page.waitForTimeout(500); // Wait for iframes to load

    // Access nested iframe
    const outerFrame = page.frameLocator('#outerFrame');
    const innerFrame = outerFrame.frameLocator('#innerFrame');

    // Interact with element in nested iframe
    await expect(innerFrame.locator('#nestedContent')).toHaveText('Nested IFrame Content');

    console.log('Successfully accessed nested iframe');
  });

  test('Multiple iframes on same page', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Page with Multiple IFrames</h1>
          <iframe id="frame1" src="data:text/html,<html><body><div id='content1'>Frame 1 Content</div></body></html>"></iframe>
          <iframe id="frame2" src="data:text/html,<html><body><div id='content2'>Frame 2 Content</div></body></html>"></iframe>
          <iframe id="frame3" src="data:text/html,<html><body><div id='content3'>Frame 3 Content</div></body></html>"></iframe>
        </body>
      </html>
    `);

    // Access different frames
    const frame1 = page.frameLocator('#frame1');
    const frame2 = page.frameLocator('#frame2');
    const frame3 = page.frameLocator('#frame3');

    // Verify content in each frame
    await expect(frame1.locator('#content1')).toHaveText('Frame 1 Content');
    await expect(frame2.locator('#content2')).toHaveText('Frame 2 Content');
    await expect(frame3.locator('#content3')).toHaveText('Frame 3 Content');

    console.log('Verified content in all 3 iframes');
  });
});

test.describe('IFrame Form Interactions', () => {

  test('Fill form inside iframe', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Main Page</h1>
          <iframe id="formFrame" src="data:text/html,
            <html>
              <body>
                <form id='loginForm'>
                  <input type='text' id='username' placeholder='Username'/>
                  <input type='password' id='password' placeholder='Password'/>
                  <input type='checkbox' id='remember'/>
                  <label for='remember'>Remember me</label>
                  <select id='role'>
                    <option value=''>Select role</option>
                    <option value='admin'>Admin</option>
                    <option value='user'>User</option>
                  </select>
                  <button type='submit' id='loginBtn'>Login</button>
                </form>
              </body>
            </html>
          "></iframe>
        </body>
      </html>
    `);

    const frame = page.frameLocator('#formFrame');

    // Fill form fields inside iframe
    await frame.locator('#username').fill('john.doe');
    await frame.locator('#password').fill('SecurePass123');
    await frame.locator('#remember').check();
    await frame.locator('#role').selectOption('admin');

    // Verify values
    await expect(frame.locator('#username')).toHaveValue('john.doe');
    await expect(frame.locator('#remember')).toBeChecked();

    // Submit form
    await frame.locator('#loginBtn').click();

    console.log('Form inside iframe filled and submitted');
  });

  test('Handle iframe with buttons and alerts', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <iframe id="alertFrame" src="data:text/html,
            <html>
              <body>
                <button id='alertBtn' onclick='alert(\"Alert from iframe!\")'>Show Alert</button>
                <button id='confirmBtn' onclick='confirm(\"Confirm from iframe?\")'>Show Confirm</button>
              </body>
            </html>
          "></iframe>
        </body>
      </html>
    `);

    const frame = page.frameLocator('#alertFrame');

    // Handle alert dialog
    page.on('dialog', async dialog => {
      console.log('Dialog message:', dialog.message());
      expect(dialog.message()).toBe('Alert from iframe!');
      await dialog.accept();
    });

    await frame.locator('#alertBtn').click();

    console.log('Alert from iframe handled');
  });
});

test.describe('Dynamic IFrame Loading', () => {

  test('Wait for iframe to load', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="loadFrame">Load IFrame</button>
          <div id="frameContainer"></div>
          <script>
            document.getElementById('loadFrame').addEventListener('click', function() {
              setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.id = 'dynamicFrame';
                iframe.src = 'data:text/html,<html><body><h2 id=dynamicContent>Dynamically Loaded Frame</h2></body></html>';
                document.getElementById('frameContainer').appendChild(iframe);
              }, 1000);
            });
          </script>
        </body>
      </html>
    `);

    // Click to load iframe
    await page.locator('#loadFrame').click();

    // Wait for iframe to be attached
    await page.locator('#dynamicFrame').waitFor({ state: 'attached' });

    // Wait a bit for iframe content to load
    await page.waitForTimeout(500);

    // Access the dynamically loaded iframe
    const frame = page.frameLocator('#dynamicFrame');
    await expect(frame.locator('#dynamicContent')).toHaveText('Dynamically Loaded Frame');

    console.log('Dynamically loaded iframe accessed successfully');
  });

  test('Switch between parent and iframe', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1 id="mainHeading">Main Page Heading</h1>
          <iframe id="contentFrame" src="data:text/html,
            <html>
              <body>
                <h2 id='frameHeading'>IFrame Heading</h2>
                <p id='frameText'>IFrame paragraph</p>
              </body>
            </html>
          "></iframe>
          <p id="mainText">Main page paragraph</p>
        </body>
      </html>
    `);

    // Verify element on main page
    await expect(page.locator('#mainHeading')).toHaveText('Main Page Heading');

    // Switch to iframe
    const frame = page.frameLocator('#contentFrame');
    await expect(frame.locator('#frameHeading')).toHaveText('IFrame Heading');

    // Back to main page
    await expect(page.locator('#mainText')).toHaveText('Main page paragraph');

    console.log('Switched between parent page and iframe');
  });
});

test.describe('Real-World IFrame Scenarios', () => {

  test('Payment gateway iframe simulation', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Checkout Page</h1>
          <div id="orderSummary">Total: $99.99</div>
          <iframe id="paymentFrame" src="data:text/html,
            <html>
              <body style='font-family: Arial; padding: 20px; border: 1px solid #ccc;'>
                <h3>Secure Payment</h3>
                <input type='text' id='cardNumber' placeholder='Card Number' />
                <input type='text' id='cardName' placeholder='Cardholder Name' />
                <input type='text' id='expiry' placeholder='MM/YY' />
                <input type='text' id='cvv' placeholder='CVV' />
                <button id='payBtn'>Pay Now</button>
              </body>
            </html>
          " style="width: 100%; height: 300px; border: 2px solid #007bff;"></iframe>
        </body>
      </html>
    `);

    // Interact with payment iframe
    const paymentFrame = page.frameLocator('#paymentFrame');

    await paymentFrame.locator('#cardNumber').fill('4111111111111111');
    await paymentFrame.locator('#cardName').fill('John Doe');
    await paymentFrame.locator('#expiry').fill('12/25');
    await paymentFrame.locator('#cvv').fill('123');

    // Verify payment button is visible
    await expect(paymentFrame.locator('#payBtn')).toBeVisible();

    await paymentFrame.locator('#payBtn').click();

    console.log('Payment form in iframe filled and submitted');
  });

  test('Social media embed iframe', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Blog Post</h1>
          <p>Check out this embedded content:</p>
          <iframe id="socialEmbed" src="data:text/html,
            <html>
              <body style='padding: 10px; background: #f0f0f0;'>
                <div style='background: white; padding: 15px; border-radius: 8px;'>
                  <p><strong>Social Media Post</strong></p>
                  <p>This is an embedded social media post.</p>
                  <button id='likeBtn'>Like</button>
                  <button id='shareBtn'>Share</button>
                  <span id='likeCount'>0</span> likes
                </div>
              </body>
            </html>
          " style="width: 400px; height: 200px; border: none;"></iframe>
        </body>
      </html>
    `);

    const embedFrame = page.frameLocator('#socialEmbed');

    // Click like button
    await embedFrame.locator('#likeBtn').click();

    // Verify like button is visible
    await expect(embedFrame.locator('#shareBtn')).toBeVisible();

    console.log('Interacted with social media embed iframe');
  });

  test('Google Maps iframe simulation', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Contact Us</h1>
          <p>Visit our office:</p>
          <iframe id="mapFrame" src="data:text/html,
            <html>
              <body style='margin: 0;'>
                <div id='map' style='width: 100%; height: 100%; background: #e0e0e0; display: flex; align-items: center; justify-content: center;'>
                  <div style='text-align: center;'>
                    <h3>Map Placeholder</h3>
                    <button id='directions'>Get Directions</button>
                    <button id='zoomIn'>Zoom In</button>
                    <button id='zoomOut'>Zoom Out</button>
                  </div>
                </div>
              </body>
            </html>
          " style="width: 600px; height: 400px; border: 1px solid #ccc;"></iframe>
        </body>
      </html>
    `);

    const mapFrame = page.frameLocator('#mapFrame');

    // Interact with map controls
    await mapFrame.locator('#zoomIn').click();
    await mapFrame.locator('#directions').click();

    await expect(mapFrame.locator('#zoomOut')).toBeVisible();

    console.log('Interacted with map iframe controls');
  });

  test('Advertisement iframe', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Article Content</h1>
          <p>Main article text goes here...</p>
          <div id="adContainer">
            <iframe id="adFrame" src="data:text/html,
              <html>
                <body style='text-align: center; padding: 20px; background: #fffacd;'>
                  <h4>Advertisement</h4>
                  <p>Special Offer - Click Here!</p>
                  <button id='closeAd' style='position: absolute; top: 5px; right: 5px;'>X</button>
                  <a href='#' id='adLink'>Learn More</a>
                </body>
              </html>
            " style="width: 300px; height: 250px; border: 1px solid #ddd;"></iframe>
          </div>
        </body>
      </html>
    `);

    const adFrame = page.frameLocator('#adFrame');

    // Verify ad is visible
    await expect(adFrame.locator('#adLink')).toBeVisible();

    // Close ad
    await adFrame.locator('#closeAd').click();

    console.log('Advertisement iframe interacted with');
  });
});

test.describe('IFrame Attributes and Properties', () => {

  test('Get iframe count on page', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <iframe src="data:text/html,<html><body>Frame 1</body></html>"></iframe>
          <iframe src="data:text/html,<html><body>Frame 2</body></html>"></iframe>
          <iframe src="data:text/html,<html><body>Frame 3</body></html>"></iframe>
        </body>
      </html>
    `);

    // Count iframes using page.frames() - includes main frame
    const allFrames = page.frames();
    console.log('Total frames (including main):', allFrames.length);
    expect(allFrames.length).toBe(4); // 1 main + 3 iframes

    // Count iframe elements
    const iframeCount = await page.locator('iframe').count();
    console.log('IFrame elements:', iframeCount);
    expect(iframeCount).toBe(3);
  });

  test('Check if element is inside iframe', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="mainContent">Main content</div>
          <iframe id="testFrame" src="data:text/html,<html><body><div id='frameContent'>Frame content</div></body></html>"></iframe>
        </body>
      </html>
    `);

    // Element on main page
    await expect(page.locator('#mainContent')).toBeVisible();

    // Element inside iframe
    const frame = page.frameLocator('#testFrame');
    await expect(frame.locator('#frameContent')).toBeVisible();

    console.log('Verified elements in both main page and iframe');
  });
});
