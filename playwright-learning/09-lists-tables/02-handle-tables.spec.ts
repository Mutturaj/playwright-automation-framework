import { test, expect } from '@playwright/test';

/**
 * Table Handling in Playwright
 * Important SDET Interview Topic
 * Working with HTML tables - rows, columns, cells
 */

test.describe('Basic Table Operations', () => {

  test('Count table rows and columns', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="dataTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>30</td>
                <td>New York</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>25</td>
                <td>Los Angeles</td>
              </tr>
              <tr>
                <td>Bob Johnson</td>
                <td>35</td>
                <td>Chicago</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Count rows (excluding header)
    const rowCount = await page.locator('#dataTable tbody tr').count();
    console.log('Number of rows:', rowCount);
    expect(rowCount).toBe(3);

    // Count columns
    const columnCount = await page.locator('#dataTable thead th').count();
    console.log('Number of columns:', columnCount);
    expect(columnCount).toBe(3);
  });

  test('Get all header texts', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="employees">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>Alice</td>
                <td>Engineering</td>
                <td>$80,000</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Get all header texts
    const headers = await page.locator('#employees thead th').allTextContents();
    console.log('Table headers:', headers);
    expect(headers).toEqual(['Employee ID', 'Name', 'Department', 'Salary']);
  });

  test('Access specific cell by row and column', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="matrix">
            <tbody>
              <tr>
                <td>A1</td>
                <td>B1</td>
                <td>C1</td>
              </tr>
              <tr>
                <td>A2</td>
                <td>B2</td>
                <td>C2</td>
              </tr>
              <tr>
                <td>A3</td>
                <td>B3</td>
                <td>C3</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Access cell at row 2, column 3 (0-indexed)
    const cell = page.locator('#matrix tbody tr').nth(1).locator('td').nth(2);
    await expect(cell).toHaveText('C2');

    // Access first row, first cell
    const firstCell = page.locator('#matrix tbody tr').first().locator('td').first();
    await expect(firstCell).toHaveText('A1');

    console.log('Accessed specific cells');
  });
});

test.describe('Extract Data from Table', () => {

  test('Extract all data from table', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="students">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>Alice</td>
                <td>A</td>
              </tr>
              <tr>
                <td>102</td>
                <td>Bob</td>
                <td>B</td>
              </tr>
              <tr>
                <td>103</td>
                <td>Charlie</td>
                <td>A+</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    const rows = page.locator('#students tbody tr');
    const rowCount = await rows.count();

    const tableData = [];

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      const id = await cells.nth(0).textContent();
      const name = await cells.nth(1).textContent();
      const grade = await cells.nth(2).textContent();

      tableData.push({ id, name, grade });
    }

    console.log('Extracted table data:', tableData);
    expect(tableData.length).toBe(3);
    expect(tableData[2].grade).toBe('A+');
  });

  test('Extract specific column data', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="products">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptop</td>
                <td>$999</td>
                <td>15</td>
              </tr>
              <tr>
                <td>Mouse</td>
                <td>$25</td>
                <td>50</td>
              </tr>
              <tr>
                <td>Keyboard</td>
                <td>$75</td>
                <td>30</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Extract all product names (first column)
    const productNames = await page.locator('#products tbody tr td:nth-child(1)').allTextContents();
    console.log('Product names:', productNames);
    expect(productNames).toEqual(['Laptop', 'Mouse', 'Keyboard']);

    // Extract all prices (second column)
    const prices = await page.locator('#products tbody tr td:nth-child(2)').allTextContents();
    console.log('Prices:', prices);
    expect(prices).toContain('$999');
  });
});

test.describe('Search and Filter Table', () => {

  test('Find row by cell value', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="users">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>john_doe</td>
                <td>john@example.com</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>jane_smith</td>
                <td>jane@example.com</td>
                <td>Inactive</td>
              </tr>
              <tr>
                <td>bob_wilson</td>
                <td>bob@example.com</td>
                <td>Active</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Find row containing "jane_smith"
    const janeRow = page.locator('#users tbody tr').filter({ hasText: 'jane_smith' });
    await expect(janeRow).toBeVisible();

    // Get status for jane_smith
    const status = await janeRow.locator('td').nth(2).textContent();
    console.log('Jane\'s status:', status);
    expect(status).toBe('Inactive');
  });

  test('Filter rows by condition', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="orders">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1001</td>
                <td>Alice</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>1002</td>
                <td>Bob</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>1003</td>
                <td>Charlie</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>1004</td>
                <td>David</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Find all completed orders
    const completedOrders = page.locator('#orders tbody tr').filter({ hasText: 'Completed' });
    const completedCount = await completedOrders.count();

    console.log('Completed orders:', completedCount);
    expect(completedCount).toBe(2);

    // Find all pending orders
    const pendingOrders = page.locator('#orders tbody tr').filter({ hasText: 'Pending' });
    const pendingCount = await pendingOrders.count();

    console.log('Pending orders:', pendingCount);
    expect(pendingCount).toBe(2);
  });
});

test.describe('Table Interactions', () => {

  test('Click button in specific table row', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="actions">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item 1</td>
                <td><button class="delete-btn">Delete</button></td>
              </tr>
              <tr>
                <td>Item 2</td>
                <td><button class="delete-btn">Delete</button></td>
              </tr>
              <tr>
                <td>Item 3</td>
                <td><button class="delete-btn">Delete</button></td>
              </tr>
            </tbody>
          </table>
          <div id="message"></div>
          <script>
            document.querySelectorAll('.delete-btn').forEach((btn, index) => {
              btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const itemName = row.querySelector('td').textContent;
                document.getElementById('message').textContent = 'Deleted: ' + itemName;
                row.remove();
              });
            });
          </script>
        </body>
      </html>
    `);

    // Click delete button in row containing "Item 2"
    const row = page.locator('#actions tbody tr').filter({ hasText: 'Item 2' });
    await row.locator('.delete-btn').click();

    // Verify message
    await expect(page.locator('#message')).toHaveText('Deleted: Item 1');

    // Verify row count decreased
    const remainingRows = await page.locator('#actions tbody tr').count();
    expect(remainingRows).toBe(2);
  });

  test('Select checkbox in table row', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="tasks">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll"></th>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" class="task-checkbox"></td>
                <td>Task 1</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td><input type="checkbox" class="task-checkbox"></td>
                <td>Task 2</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td><input type="checkbox" class="task-checkbox"></td>
                <td>Task 3</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Select checkbox in second row
    await page.locator('#tasks tbody tr').nth(1).locator('.task-checkbox').check();

    // Verify it's checked
    await expect(page.locator('#tasks tbody tr').nth(1).locator('.task-checkbox')).toBeChecked();

    // Select all checkboxes
    const checkboxes = page.locator('.task-checkbox');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    // Verify all are checked
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }

    console.log('All checkboxes selected');
  });

  test('Edit cell value in table', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="editable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Setting 1</td>
                <td><input type="text" class="value-input" value="100"></td>
                <td><button class="save-btn">Save</button></td>
              </tr>
              <tr>
                <td>Setting 2</td>
                <td><input type="text" class="value-input" value="200"></td>
                <td><button class="save-btn">Save</button></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    // Edit value in first row
    const firstRowInput = page.locator('#editable tbody tr').first().locator('.value-input');
    await firstRowInput.clear();
    await firstRowInput.fill('150');

    // Verify new value
    await expect(firstRowInput).toHaveValue('150');

    // Click save button
    await page.locator('#editable tbody tr').first().locator('.save-btn').click();

    console.log('Cell value edited');
  });
});

test.describe('Sort Table Data', () => {

  test('Verify table sorting', async ({ page }) => {
    await page.setContent(`
      <html>
        <head>
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; }
            th { cursor: pointer; background: #f0f0f0; }
          </style>
        </head>
        <body>
          <table id="sortable">
            <thead>
              <tr>
                <th id="sortName">Name</th>
                <th id="sortAge">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Charlie</td><td>35</td></tr>
              <tr><td>Alice</td><td>28</td></tr>
              <tr><td>Bob</td><td>42</td></tr>
            </tbody>
          </table>
          <script>
            document.getElementById('sortName').addEventListener('click', function() {
              const tbody = document.querySelector('#sortable tbody');
              const rows = Array.from(tbody.querySelectorAll('tr'));
              rows.sort((a, b) => a.cells[0].textContent.localeCompare(b.cells[0].textContent));
              rows.forEach(row => tbody.appendChild(row));
            });

            document.getElementById('sortAge').addEventListener('click', function() {
              const tbody = document.querySelector('#sortable tbody');
              const rows = Array.from(tbody.querySelectorAll('tr'));
              rows.sort((a, b) => parseInt(a.cells[1].textContent) - parseInt(b.cells[1].textContent));
              rows.forEach(row => tbody.appendChild(row));
            });
          </script>
        </body>
      </html>
    `);

    // Get initial first row
    let firstRowName = await page.locator('#sortable tbody tr').first().locator('td').first().textContent();
    console.log('Before sort:', firstRowName);

    // Click to sort by name
    await page.locator('#sortName').click();

    // Verify sorted
    firstRowName = await page.locator('#sortable tbody tr').first().locator('td').first().textContent();
    console.log('After sort:', firstRowName);
    expect(firstRowName).toBe('Alice');

    // Get all names in order
    const names = await page.locator('#sortable tbody tr td:nth-child(1)').allTextContents();
    console.log('Sorted names:', names);
    expect(names).toEqual(['Alice', 'Bob', 'Charlie']);
  });
});

test.describe('Dynamic Tables', () => {

  test('Handle dynamically added rows', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="addRow">Add Row</button>
          <table id="dynamic">
            <thead>
              <tr>
                <th>ID</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <script>
            let counter = 1;
            document.getElementById('addRow').addEventListener('click', function() {
              const tbody = document.querySelector('#dynamic tbody');
              const row = tbody.insertRow();
              row.insertCell(0).textContent = counter;
              row.insertCell(1).textContent = 'Value ' + counter;
              counter++;
            });
          </script>
        </body>
      </html>
    `);

    // Add 5 rows
    for (let i = 0; i < 5; i++) {
      await page.locator('#addRow').click();
    }

    // Verify row count
    const rowCount = await page.locator('#dynamic tbody tr').count();
    expect(rowCount).toBe(5);

    console.log('Added 5 dynamic rows');
  });

  test('Wait for table data to load', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <button id="loadData">Load Data</button>
          <table id="asyncTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div id="loading" style="display: none;">Loading...</div>
          <script>
            document.getElementById('loadData').addEventListener('click', function() {
              document.getElementById('loading').style.display = 'block';
              setTimeout(() => {
                const tbody = document.querySelector('#asyncTable tbody');
                const data = [
                  ['Alice', 'Active'],
                  ['Bob', 'Active'],
                  ['Charlie', 'Inactive']
                ];
                data.forEach(item => {
                  const row = tbody.insertRow();
                  row.insertCell(0).textContent = item[0];
                  row.insertCell(1).textContent = item[1];
                });
                document.getElementById('loading').style.display = 'none';
              }, 2000);
            });
          </script>
        </body>
      </html>
    `);

    await page.locator('#loadData').click();

    // Wait for loading indicator
    await expect(page.locator('#loading')).toBeVisible();

    // Wait for table to populate
    await page.locator('#asyncTable tbody tr').first().waitFor({ state: 'attached' });

    // Wait for loading to disappear
    await expect(page.locator('#loading')).not.toBeVisible();

    // Verify data loaded
    const rowCount = await page.locator('#asyncTable tbody tr').count();
    expect(rowCount).toBe(3);

    console.log('Table data loaded asynchronously');
  });
});

test.describe('Complex Table Scenarios', () => {

  test('Handle table with pagination', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <table id="paginatedTable">
            <tbody>
              <tr class="page1"><td>Row 1</td></tr>
              <tr class="page1"><td>Row 2</td></tr>
              <tr class="page1"><td>Row 3</td></tr>
              <tr class="page2" style="display: none;"><td>Row 4</td></tr>
              <tr class="page2" style="display: none;"><td>Row 5</td></tr>
              <tr class="page2" style="display: none;"><td>Row 6</td></tr>
            </tbody>
          </table>
          <button id="page1">Page 1</button>
          <button id="page2">Page 2</button>
          <script>
            document.getElementById('page1').addEventListener('click', function() {
              document.querySelectorAll('.page1').forEach(r => r.style.display = 'table-row');
              document.querySelectorAll('.page2').forEach(r => r.style.display = 'none');
            });
            document.getElementById('page2').addEventListener('click', function() {
              document.querySelectorAll('.page1').forEach(r => r.style.display = 'none');
              document.querySelectorAll('.page2').forEach(r => r.style.display = 'table-row');
            });
          </script>
        </body>
      </html>
    `);

    // Verify page 1
    let visibleRows = await page.locator('#paginatedTable tbody tr:visible').count();
    expect(visibleRows).toBe(3);

    // Go to page 2
    await page.locator('#page2').click();

    // Verify page 2
    visibleRows = await page.locator('#paginatedTable tbody tr:visible').count();
    expect(visibleRows).toBe(3);

    console.log('Navigated table pagination');
  });
});
