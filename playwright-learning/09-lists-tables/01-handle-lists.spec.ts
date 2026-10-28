import { test, expect } from '@playwright/test';

/**
 * Handling Lists and Multiple Elements
 * Common SDET Interview Question
 * Working with collections of elements
 */

test.describe('Basic List Operations', () => {

  test('Count elements in a list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add multiple todos
    const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Count list items
    const count = await page.locator('.todo-list li').count();
    console.log('Total tasks:', count);
    expect(count).toBe(5);
  });

  test('Get text from all list items', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add todos
    const tasks = ['Buy milk', 'Walk dog', 'Read book'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Get all text contents
    const allTexts = await page.locator('.todo-list li label').allTextContents();
    console.log('All task texts:', allTexts);

    expect(allTexts).toEqual(['Buy milk', 'Walk dog', 'Read book']);
  });

  test('Access list elements by index', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add todos
    const tasks = ['First', 'Second', 'Third', 'Fourth'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Access by index (0-based)
    const firstItem = page.locator('.todo-list li').nth(0);
    const secondItem = page.locator('.todo-list li').nth(1);
    const lastItem = page.locator('.todo-list li').last();

    await expect(firstItem.locator('label')).toHaveText('First');
    await expect(secondItem.locator('label')).toHaveText('Second');
    await expect(lastItem.locator('label')).toHaveText('Fourth');

    console.log('Accessed list items by index');
  });

  test('First and last elements', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const tasks = ['Alpha', 'Beta', 'Gamma', 'Delta'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Get first and last
    const firstTask = page.locator('.todo-list li').first();
    const lastTask = page.locator('.todo-list li').last();

    await expect(firstTask.locator('label')).toHaveText('Alpha');
    await expect(lastTask.locator('label')).toHaveText('Delta');
  });
});

test.describe('Iterating Through Lists', () => {

  test('Iterate and perform action on each element', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add multiple tasks
    for (let i = 1; i <= 5; i++) {
      await page.locator('.new-todo').fill(`Task ${i}`);
      await page.locator('.new-todo').press('Enter');
    }

    // Get all list items
    const items = page.locator('.todo-list li');
    const count = await items.count();

    // Iterate through each item
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const text = await item.locator('label').textContent();
      console.log(`Item ${i}: ${text}`);
    }

    console.log('Iterated through all list items');
  });

  test('Check all checkboxes in a list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add tasks
    const tasks = ['Task A', 'Task B', 'Task C'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Check all checkboxes
    const checkboxes = page.locator('.todo-list li .toggle');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    // Verify all are checked
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }

    console.log('All checkboxes checked');
  });

  test('Find specific item in list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add tasks
    const tasks = ['Buy groceries', 'Pay bills', 'Call mom', 'Fix bugs', 'Write tests'];
    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Find item containing specific text
    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Fix bugs' });
    await expect(targetItem).toBeVisible();

    // Click checkbox for that specific item
    await targetItem.locator('.toggle').check();
    await expect(targetItem).toHaveClass(/completed/);

    console.log('Found and completed specific item');
  });
});

test.describe('Filter and Search in Lists', () => {

  test('Filter list items by text', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Add diverse tasks
    const tasks = [
      'Buy milk',
      'Buy bread',
      'Walk the dog',
      'Buy eggs',
      'Read book'
    ];

    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Filter items containing "Buy"
    const buyItems = page.locator('.todo-list li').filter({ hasText: 'Buy' });
    const buyCount = await buyItems.count();

    console.log('Items with "Buy":', buyCount);
    expect(buyCount).toBe(3);

    // Get their texts
    const buyTexts = await buyItems.locator('label').allTextContents();
    console.log('Buy items:', buyTexts);
  });

  test('Get items NOT containing specific text', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const tasks = ['Important task', 'Normal task', 'Important meeting', 'Regular work'];

    for (const task of tasks) {
      await page.locator('.new-todo').fill(task);
      await page.locator('.new-todo').press('Enter');
    }

    // Get all items
    const allItems = page.locator('.todo-list li');
    const totalCount = await allItems.count();

    // Get important items
    const importantItems = allItems.filter({ hasText: 'Important' });
    const importantCount = await importantItems.count();

    console.log(`Total: ${totalCount}, Important: ${importantCount}, Regular: ${totalCount - importantCount}`);
  });

  test('Filter by has() - containing another element', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <ul id="productList">
            <li class="product">
              <span class="name">Product 1</span>
              <span class="badge sale">SALE</span>
            </li>
            <li class="product">
              <span class="name">Product 2</span>
            </li>
            <li class="product">
              <span class="name">Product 3</span>
              <span class="badge sale">SALE</span>
            </li>
            <li class="product">
              <span class="name">Product 4</span>
            </li>
          </ul>
        </body>
      </html>
    `);

    // Find products that have a "SALE" badge
    const productsOnSale = page.locator('.product').filter({
      has: page.locator('.badge.sale')
    });

    const saleCount = await productsOnSale.count();
    console.log('Products on sale:', saleCount);
    expect(saleCount).toBe(2);
  });
});

test.describe('Extract Data from Lists', () => {

  test('Extract all attributes from list items', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <ul id="items">
            <li data-id="1" data-priority="high">Item 1</li>
            <li data-id="2" data-priority="medium">Item 2</li>
            <li data-id="3" data-priority="low">Item 3</li>
            <li data-id="4" data-priority="high">Item 4</li>
          </ul>
        </body>
      </html>
    `);

    const items = page.locator('#items li');
    const count = await items.count();

    const itemData = [];

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const id = await item.getAttribute('data-id');
      const priority = await item.getAttribute('data-priority');
      const text = await item.textContent();

      itemData.push({ id, priority, text });
    }

    console.log('Extracted item data:', itemData);
    expect(itemData.length).toBe(4);
    expect(itemData[0].priority).toBe('high');
  });

  test('Get complex data from list', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <ul id="users">
            <li class="user">
              <span class="name">John Doe</span>
              <span class="email">john@example.com</span>
              <span class="role">Admin</span>
            </li>
            <li class="user">
              <span class="name">Jane Smith</span>
              <span class="email">jane@example.com</span>
              <span class="role">User</span>
            </li>
            <li class="user">
              <span class="name">Bob Johnson</span>
              <span class="email">bob@example.com</span>
              <span class="role">User</span>
            </li>
          </ul>
        </body>
      </html>
    `);

    const users = page.locator('.user');
    const count = await users.count();

    const userData = [];

    for (let i = 0; i < count; i++) {
      const user = users.nth(i);
      const name = await user.locator('.name').textContent();
      const email = await user.locator('.email').textContent();
      const role = await user.locator('.role').textContent();

      userData.push({ name, email, role });
    }

    console.log('User data:', userData);

    // Find admins
    const admins = userData.filter(u => u.role === 'Admin');
    console.log('Admins:', admins);
    expect(admins.length).toBe(1);
  });
});

test.describe('Dynamic Lists', () => {

  test('Handle dynamically added list items', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="addItem">Add Item</button>
          <ul id="dynamicList"></ul>
          <script>
            let counter = 0;
            document.getElementById('addItem').addEventListener('click', function() {
              counter++;
              const li = document.createElement('li');
              li.textContent = 'Dynamic Item ' + counter;
              li.className = 'dynamic-item';
              document.getElementById('dynamicList').appendChild(li);
            });
          </script>
        </body>
      </html>
    `);

    // Add items dynamically
    for (let i = 0; i < 5; i++) {
      await page.locator('#addItem').click();
      await page.waitForTimeout(100);
    }

    // Count dynamic items
    const items = page.locator('.dynamic-item');
    const count = await items.count();

    console.log('Dynamic items added:', count);
    expect(count).toBe(5);
  });

  test('Wait for list to populate', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="loadData">Load Data</button>
          <ul id="dataList"></ul>
          <script>
            document.getElementById('loadData').addEventListener('click', function() {
              setTimeout(() => {
                for (let i = 1; i <= 10; i++) {
                  const li = document.createElement('li');
                  li.textContent = 'Data Item ' + i;
                  li.className = 'data-item';
                  document.getElementById('dataList').appendChild(li);
                }
              }, 1000);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#loadData').click();

    // Wait for first item to appear
    await page.locator('.data-item').first().waitFor({ state: 'attached' });

    // Wait for specific count
    await expect(page.locator('.data-item')).toHaveCount(10);

    console.log('List populated with 10 items');
  });
});

test.describe('Real-World List Scenarios', () => {

  test('Shopping cart - Add and remove items', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h2>Available Products</h2>
          <div class="products">
            <div class="product" data-id="1">
              <span>Product A - $10</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
            <div class="product" data-id="2">
              <span>Product B - $20</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
            <div class="product" data-id="3">
              <span>Product C - $30</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
          </div>

          <h2>Shopping Cart</h2>
          <ul id="cart"></ul>
          <div id="total">Total: $0</div>

          <script>
            let cart = [];
            let total = 0;

            document.querySelectorAll('.add-to-cart').forEach(button => {
              button.addEventListener('click', function() {
                const product = this.parentElement;
                const id = product.getAttribute('data-id');
                const text = product.querySelector('span').textContent;
                const price = parseInt(text.match(/\\$(\\d+)/)[1]);

                cart.push({ id, text, price });
                total += price;

                updateCart();
              });
            });

            function updateCart() {
              const cartEl = document.getElementById('cart');
              cartEl.innerHTML = '';
              cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = item.text + ' <button class="remove" data-index="' + index + '">Remove</button>';
                cartEl.appendChild(li);
              });

              document.querySelectorAll('.remove').forEach(button => {
                button.addEventListener('click', function() {
                  const index = parseInt(this.getAttribute('data-index'));
                  total -= cart[index].price;
                  cart.splice(index, 1);
                  updateCart();
                });
              });

              document.getElementById('total').textContent = 'Total: $' + total;
            }
          </script>
        </body>
      </html>
    `);

    // Add products to cart
    await page.locator('.product[data-id="1"] .add-to-cart').click();
    await page.locator('.product[data-id="3"] .add-to-cart').click();

    // Verify cart
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);

    // Verify total
    await expect(page.locator('#total')).toHaveText('Total: $40');

    // Remove an item
    await page.locator('.remove').first().click();
    await expect(cartItems).toHaveCount(1);
    await expect(page.locator('#total')).toHaveText('Total: $30');

    console.log('Shopping cart test completed');
  });

  test('Search and filter list', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <input type="text" id="searchInput" placeholder="Search...">
          <ul id="itemList">
            <li class="item">Apple</li>
            <li class="item">Banana</li>
            <li class="item">Cherry</li>
            <li class="item">Date</li>
            <li class="item">Elderberry</li>
            <li class="item">Fig</li>
            <li class="item">Grape</li>
          </ul>
          <script>
            document.getElementById('searchInput').addEventListener('input', function() {
              const searchTerm = this.value.toLowerCase();
              const items = document.querySelectorAll('.item');

              items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                  item.style.display = 'list-item';
                } else {
                  item.style.display = 'none';
                }
              });
            });
          </script>
        </body>
      </html>
    `);

    // Initial count
    const initialCount = await page.locator('.item').count();
    console.log('Initial items:', initialCount);

    // Search for "e"
    await page.locator('#searchInput').fill('e');

    // Count visible items
    const visibleItems = page.locator('.item:visible');
    const visibleCount = await visibleItems.count();

    console.log('Visible items after search:', visibleCount);
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(initialCount);
  });
});
