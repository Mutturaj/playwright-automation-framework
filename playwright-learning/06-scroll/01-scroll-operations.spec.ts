import { test, expect } from '@playwright/test';

/**
 * Scroll Operations in Playwright
 * SDET Interview Topic - Handling Different Scroll Scenarios
 */

test.describe('Basic Scroll Operations', () => {

  test('Scroll element into view', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Find an element at the bottom of the page
    const footer = page.locator('footer');

    // Scroll element into view
    await footer.scrollIntoViewIfNeeded();

    // Verify element is in viewport
    await expect(footer).toBeInViewport();
    console.log('Element scrolled into view');
  });

  test('Scroll to specific element', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Scroll to a specific section
    const communitySection = page.locator('text=Community').first();
    await communitySection.scrollIntoViewIfNeeded();

    await expect(communitySection).toBeInViewport();
  });

  test('Scroll automatically happens with click', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Playwright automatically scrolls before clicking
    // No explicit scroll needed!
    const footerLink = page.locator('footer a').first();
    await footerLink.click({ force: false }); // Playwright will auto-scroll

    console.log('Playwright auto-scrolled before click');
  });
});

test.describe('Page Scroll Operations', () => {

  test('Scroll to top of page', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Scroll to bottom first
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Verify we're at the top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
    console.log('Scrolled to top of page');
  });

  test('Scroll to bottom of page', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.waitForTimeout(500);

    // Verify we're near the bottom
    const scrollY = await page.evaluate(() => window.scrollY);
    const maxScroll = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);

    expect(scrollY).toBeGreaterThan(maxScroll * 0.9); // Within 90% of max
    console.log('Scrolled to bottom of page');
  });

  test('Scroll by specific pixel amount', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Scroll down by 500 pixels
    await page.evaluate(() => window.scrollBy(0, 500));

    await page.waitForTimeout(300);

    // Verify scroll happened
    const newScroll = await page.evaluate(() => window.scrollY);
    expect(newScroll).toBe(initialScroll + 500);

    console.log(`Scrolled from ${initialScroll} to ${newScroll}`);
  });

  test('Scroll to specific coordinates', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Scroll to specific position (x: 0, y: 800)
    await page.evaluate(() => window.scrollTo(0, 800));

    await page.waitForTimeout(300);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(800);

    console.log('Scrolled to specific coordinate');
  });

  test('Smooth scroll', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Smooth scroll to bottom
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });

    await page.waitForTimeout(1000); // Wait for smooth scroll animation

    console.log('Smooth scroll completed');
  });
});

test.describe('Element-Specific Scroll', () => {

  test('Scroll within a scrollable div', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="scrollableDiv" style="height: 300px; overflow-y: scroll; border: 1px solid black;">
            <div style="height: 1000px; padding: 20px;">
              <h2>Top of scrollable area</h2>
              ${Array(50).fill('<p>Scrollable content line</p>').join('')}
              <h2 id="bottomElement">Bottom of scrollable area</h2>
            </div>
          </div>
        </body>
      </html>
    `);

    // Scroll within the div to bottom element
    const bottomElement = page.locator('#bottomElement');
    await bottomElement.scrollIntoViewIfNeeded();

    await expect(bottomElement).toBeInViewport();
    console.log('Scrolled within div to bottom element');
  });

  test('Scroll inside a container', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="container" style="height: 200px; overflow: auto; border: 1px solid black;">
            <div id="item1" style="height: 150px; background: lightblue;">Item 1</div>
            <div id="item2" style="height: 150px; background: lightgreen;">Item 2</div>
            <div id="item3" style="height: 150px; background: lightyellow;">Item 3</div>
            <div id="item4" style="height: 150px; background: lightcoral;">Item 4</div>
          </div>
        </body>
      </html>
    `);

    const container = page.locator('#container');
    const item4 = page.locator('#item4');

    // Scroll container to bring item4 into view
    await item4.scrollIntoViewIfNeeded();

    await expect(item4).toBeVisible();
    console.log('Scrolled container to show item4');
  });

  test('Scroll horizontally', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div style="width: 100%; overflow-x: scroll; white-space: nowrap; border: 1px solid black;">
            ${Array(20).fill(0).map((_, i) =>
              `<div style="display: inline-block; width: 200px; height: 100px; background: hsl(${i * 20}, 70%, 70%); margin: 5px;">${i}</div>`
            ).join('')}
          </div>
        </body>
      </html>
    `);

    // Horizontal scroll
    await page.evaluate(() => window.scrollBy(500, 0));

    await page.waitForTimeout(300);

    const scrollX = await page.evaluate(() => window.scrollX);
    expect(scrollX).toBeGreaterThan(0);

    console.log('Horizontal scroll performed');
  });
});

test.describe('Advanced Scroll Scenarios', () => {

  test('Infinite scroll - Load more content', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="content">
            ${Array(10).fill(0).map((_, i) => `<div class="item">Item ${i + 1}</div>`).join('')}
          </div>
          <div id="loading" style="display: none;">Loading more...</div>
          <script>
            let itemCount = 10;
            window.addEventListener('scroll', function() {
              if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                if (itemCount < 50) {
                  document.getElementById('loading').style.display = 'block';
                  setTimeout(() => {
                    const content = document.getElementById('content');
                    for (let i = 0; i < 10; i++) {
                      itemCount++;
                      const div = document.createElement('div');
                      div.className = 'item';
                      div.textContent = 'Item ' + itemCount;
                      content.appendChild(div);
                    }
                    document.getElementById('loading').style.display = 'none';
                  }, 1000);
                }
              }
            });
          </script>
        </body>
      </html>
    `);

    // Initial item count
    let itemCount = await page.locator('.item').count();
    console.log('Initial items:', itemCount);

    // Scroll to bottom to trigger load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for loading indicator
    await page.locator('#loading').waitFor({ state: 'visible' });
    await page.locator('#loading').waitFor({ state: 'hidden' });

    // Verify more items loaded
    const newItemCount = await page.locator('.item').count();
    console.log('Items after scroll:', newItemCount);
    expect(newItemCount).toBeGreaterThan(itemCount);
  });

  test('Lazy loading images on scroll', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Scroll to load images</h1>
          ${Array(10).fill(0).map((_, i) => `
            <div style="height: 400px; margin: 20px; border: 1px solid black;">
              <img data-src="https://via.placeholder.com/600x300?text=Image${i + 1}"
                   alt="Image ${i + 1}"
                   style="width: 100%; height: 300px; background: #eee;">
            </div>
          `).join('')}
          <script>
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                  imageObserver.unobserve(img);
                }
              });
            });
            images.forEach(img => imageObserver.observe(img));
          </script>
        </body>
      </html>
    `);

    // Scroll down gradually to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);
    }

    // Verify images loaded
    const loadedImages = await page.locator('img[src]').count();
    console.log('Loaded images:', loadedImages);
    expect(loadedImages).toBeGreaterThan(0);
  });

  test('Scroll to specific element in long list', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h1>Long List</h1>
          <ul>
            ${Array(100).fill(0).map((_, i) => `<li id="item-${i}">List Item ${i}</li>`).join('')}
          </ul>
        </body>
      </html>
    `);

    // Scroll to item 75
    const targetItem = page.locator('#item-75');
    await targetItem.scrollIntoViewIfNeeded();

    await expect(targetItem).toBeInViewport();
    console.log('Scrolled to item 75 in long list');
  });

  test('Check if element is in viewport without scrolling', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Check header (should be in viewport)
    const header = page.locator('nav').first();
    await expect(header).toBeInViewport();

    // Check footer (may not be in viewport initially)
    const footer = page.locator('footer');
    const isFooterInView = await footer.isVisible();

    console.log('Footer in viewport initially:', isFooterInView);
  });
});

test.describe('Real-World Scroll Scenarios', () => {

  test('Accept cookies banner after scroll', async ({ page }) => {
    await page.setContent(`
      <html>
        <body style="height: 3000px;">
          <h1>Scroll down to see cookie banner</h1>
          <div id="cookieBanner" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; background: #333; color: white; padding: 20px; z-index: 1000;">
            <p>We use cookies to improve your experience.</p>
            <button id="acceptCookies">Accept</button>
          </div>
          <script>
            window.addEventListener('scroll', function() {
              if (window.scrollY > 500) {
                document.getElementById('cookieBanner').style.display = 'block';
              }
            });
            document.getElementById('acceptCookies').addEventListener('click', function() {
              document.getElementById('cookieBanner').style.display = 'none';
            });
          </script>
        </body>
      </html>
    `);     

    // Scroll to trigger cookie banner
    await page.evaluate(() => window.scrollBy(0, 600));

    // Wait for banner and accept
    await page.locator('#cookieBanner').waitFor({ state: 'visible' });
    await page.locator('#acceptCookies').click();

    await expect(page.locator('#cookieBanner')).not.toBeVisible();
    console.log('Cookie banner accepted after scroll');
  });

  test('Sticky header remains visible during scroll', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <header id="stickyHeader" style="position: sticky; top: 0; background: navy; color: white; padding: 20px; z-index: 100;">
            Sticky Header
          </header>
          <div style="height: 3000px; padding: 20px;">
            <h1>Content Area</h1>
            <p>Scroll down and the header stays visible</p>
          </div>
        </body>
      </html>
    `);

    // Verify header is visible before scroll
    await expect(page.locator('#stickyHeader')).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1000));

    // Header should still be visible (sticky)
    await expect(page.locator('#stickyHeader')).toBeVisible();
    await expect(page.locator('#stickyHeader')).toBeInViewport();

    console.log('Sticky header remains visible after scroll');
  });

  test('Read more button expands content', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div id="article">
            <p>This is the visible content...</p>
            <div id="moreContent" style="display: none; height: 1000px;">
              <p>This is the expanded content that requires scrolling...</p>
              ${Array(20).fill('<p>More content paragraph</p>').join('')}
              <p id="endMarker">End of article</p>
            </div>
            <button id="readMore">Read More</button>
          </div>
          <script>
            document.getElementById('readMore').addEventListener('click', function() {
              document.getElementById('moreContent').style.display = 'block';
              this.style.display = 'none';
            });
          </script>
        </body>
      </html>
    `);

    // Click read more
    await page.locator('#readMore').click();

    // Scroll to end of expanded content
    await page.locator('#endMarker').scrollIntoViewIfNeeded();

    await expect(page.locator('#endMarker')).toBeInViewport();
    console.log('Scrolled to end of expanded content');
  });
});
