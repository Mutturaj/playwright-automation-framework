import { test, expect } from '@playwright/test';

/**
 * Dropdown/Select Element Handling
 * Critical SDET Interview Topic
 * Different types of dropdowns and selection methods
 */

test.describe('Standard HTML Dropdowns', () => {

  test('Select by visible text', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h3>Select your country:</h3>
          <select id="country">
            <option value="">Choose...</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="in">India</option>
          </select>
        </body>
      </html>
    `);

    // Select by label/text
    await page.locator('#country').selectOption({ label: 'Canada' });

    // Verify selection
    const selectedValue = await page.locator('#country').inputValue();
    expect(selectedValue).toBe('ca');
  });

  test('Select by value attribute', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h3>Select your experience:</h3>
          <select id="experience">
            <option value="">Select...</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </body>
      </html>
    `);

    // Select by value
    await page.locator('#experience').selectOption('3-5');

    // Verify selection
    const value = await page.locator('#experience').inputValue();
    expect(value).toBe('3-5');
  });

  test('Select by index', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <select id="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </body>
      </html>
    `);

    // Select by index (0-based)
    await page.locator('#priority').selectOption({ index: 2 }); // Selects "High"

    const value = await page.locator('#priority').inputValue();
    expect(value).toBe('high');
  });

  test('Select multiple options (multi-select)', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h3>Select programming languages (multiple):</h3>
          <select id="languages" multiple>
            <option value="js">JavaScript</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
          </select>
        </body>
      </html>
    `);

    // Select multiple options
    await page.locator('#languages').selectOption(['js', 'py', 'java']);

    // Verify multiple selections using evaluate
    const selectedValues = await page.locator('#languages').evaluate((select: HTMLSelectElement) => {
      return Array.from(select.selectedOptions).map(option => option.value);
    });

    expect(selectedValues).toEqual(['js', 'py', 'java']);
  });

  test('Get all options from dropdown', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <select id="cities">
            <option value="ny">New York</option>
            <option value="la">Los Angeles</option>
            <option value="ch">Chicago</option>
            <option value="sf">San Francisco</option>
          </select>
        </body>
      </html>
    `);

    // Get all option texts
    const options = await page.locator('#cities option').allTextContents();
    console.log('Available cities:', options);
    expect(options).toHaveLength(4);
    expect(options).toContain('Chicago');
  });

  test('Get selected option text', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <select id="status">
            <option value="1">Active</option>
            <option value="2">Inactive</option>
            <option value="3">Pending</option>
          </select>
        </body>
      </html>
    `);

    await page.locator('#status').selectOption('2');

    // Get selected option text
    const selectedText = await page.locator('#status option:checked').textContent();
    console.log('Selected status:', selectedText);
    expect(selectedText).toBe('Inactive');
  });

  test('Verify dropdown has specific option', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <select id="department">
            <option value="eng">Engineering</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
            <option value="mkt">Marketing</option>
          </select>
        </body>
      </html>
    `);

    // Check if option exists
    const hasHR = await page.locator('#department option[value="hr"]').count();
    expect(hasHR).toBeGreaterThan(0);

    // Verify option text
    await expect(page.locator('#department option[value="hr"]')).toHaveText('Human Resources');
  });
});

test.describe('Custom/Modern Dropdowns', () => {

  test('Handle custom dropdown with div/ul', async ({ page }) => {
    await page.setContent(`
      <html>
        <head>
          <style>
            .custom-select { cursor: pointer; padding: 10px; border: 1px solid #ccc; }
            .options { display: none; border: 1px solid #ccc; }
            .options.open { display: block; }
            .option { padding: 10px; cursor: pointer; }
            .option:hover { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <div id="customDropdown">
            <div class="custom-select">Select a fruit</div>
            <div class="options">
              <div class="option" data-value="apple">Apple</div>
              <div class="option" data-value="banana">Banana</div>
              <div class="option" data-value="orange">Orange</div>
              <div class="option" data-value="grape">Grape</div>
            </div>
          </div>
          <script>
            document.querySelector('.custom-select').addEventListener('click', function() {
              document.querySelector('.options').classList.toggle('open');
            });
            document.querySelectorAll('.option').forEach(option => {
              option.addEventListener('click', function() {
                document.querySelector('.custom-select').textContent = this.textContent;
                document.querySelector('.options').classList.remove('open');
              });
            });
          </script>
        </body>
      </html>
    `);

    // Click to open custom dropdown
    await page.locator('.custom-select').click();

    // Wait for options to be visible
    await expect(page.locator('.options')).toHaveClass(/open/);

    // Click on desired option
    await page.locator('.option[data-value="banana"]').click();

    // Verify selection
    await expect(page.locator('.custom-select')).toHaveText('Banana');
  });

  test('Handle searchable dropdown', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <div class="searchable-dropdown">
            <input type="text" id="searchInput" placeholder="Search...">
            <ul id="optionsList">
              <li data-value="js">JavaScript</li>
              <li data-value="py">Python</li>
              <li data-value="java">Java</li>
              <li data-value="ruby">Ruby</li>
              <li data-value="go">Go</li>
            </ul>
          </div>
        </body>
      </html>
    `);

    // Type to search/filter
    await page.locator('#searchInput').fill('Pyt');

    // Click on filtered option
    await page.locator('li[data-value="py"]').click();
  });

  test('Handle autocomplete dropdown', async ({ page }) => {
    await page.setContent(`
      <html>
        <head>
          <style>
            .suggestions { border: 1px solid #ccc; max-height: 200px; overflow-y: auto; }
            .suggestion-item { padding: 10px; cursor: pointer; }
            .suggestion-item:hover { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="autocomplete">
            <input type="text" id="cityInput" placeholder="Enter city name">
            <div class="suggestions" id="suggestions" style="display: none;">
              <div class="suggestion-item">New York</div>
              <div class="suggestion-item">Los Angeles</div>
              <div class="suggestion-item">Chicago</div>
              <div class="suggestion-item">Houston</div>
            </div>
          </div>
          <script>
            document.getElementById('cityInput').addEventListener('input', function() {
              document.getElementById('suggestions').style.display = this.value ? 'block' : 'none';
            });
            document.querySelectorAll('.suggestion-item').forEach(item => {
              item.addEventListener('click', function() {
                document.getElementById('cityInput').value = this.textContent;
                document.getElementById('suggestions').style.display = 'none';
              });
            });
          </script>
        </body>
      </html>
    `);

    // Type in the input to trigger suggestions
    await page.locator('#cityInput').fill('New');

    // Wait for suggestions to appear
    await expect(page.locator('#suggestions')).toBeVisible();

    // Click on a suggestion
    await page.locator('.suggestion-item').filter({ hasText: 'New York' }).click();

    // Verify selection
    await expect(page.locator('#cityInput')).toHaveValue('New York');
  });
});

test.describe('Real-World Dropdown Scenarios', () => {

  test('Cascading/Dependent dropdowns', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <h3>Select Location:</h3>
          <select id="country">
            <option value="">Select Country</option>
            <option value="us">United States</option>
            <option value="in">India</option>
          </select>

          <select id="state" disabled>
            <option value="">Select State</option>
          </select>

          <select id="city" disabled>
            <option value="">Select City</option>
          </select>

          <script>
            const statesByCountry = {
              us: ['California', 'Texas', 'New York'],
              in: ['Maharashtra', 'Karnataka', 'Delhi']
            };

            const citiesByState = {
              'California': ['Los Angeles', 'San Francisco'],
              'Texas': ['Houston', 'Dallas'],
              'Maharashtra': ['Mumbai', 'Pune'],
              'Karnataka': ['Bangalore', 'Mysore']
            };

            document.getElementById('country').addEventListener('change', function() {
              const stateSelect = document.getElementById('state');
              stateSelect.innerHTML = '<option value="">Select State</option>';
              if (this.value) {
                stateSelect.disabled = false;
                statesByCountry[this.value].forEach(state => {
                  const option = document.createElement('option');
                  option.value = state.toLowerCase();
                  option.textContent = state;
                  stateSelect.appendChild(option);
                });
              }
              document.getElementById('city').disabled = true;
            });

            document.getElementById('state').addEventListener('change', function() {
              const citySelect = document.getElementById('city');
              citySelect.innerHTML = '<option value="">Select City</option>';
              if (this.value) {
                citySelect.disabled = false;
                const stateName = this.options[this.selectedIndex].text;
                if (citiesByState[stateName]) {
                  citiesByState[stateName].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.toLowerCase();
                    option.textContent = city;
                    citySelect.appendChild(option);
                  });
                }
              }
            });
          </script>
        </body>
      </html>
    `);

    // Select country
    await page.locator('#country').selectOption('in');

    // Wait for state dropdown to be enabled
    await expect(page.locator('#state')).toBeEnabled();

    // Select state
    await page.locator('#state').selectOption('karnataka');

    // Wait for city dropdown to be enabled
    await expect(page.locator('#city')).toBeEnabled();

    // Select city
    await page.locator('#city').selectOption('bangalore');

    // Verify all selections
    expect(await page.locator('#country').inputValue()).toBe('in');
    expect(await page.locator('#state').inputValue()).toBe('karnataka');
    expect(await page.locator('#city').inputValue()).toBe('bangalore');
  });

  test('Dropdown in a modal/popup', async ({ page }) => {
    await page.setContent(`
      <html>
        <head>
          <style>
            .modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4); }
            .modal-content { background-color: white; margin: 15% auto; padding: 20px; width: 50%; }
            .modal.show { display: block; }
          </style>
        </head>
        <body>
          <button id="openModal">Open Modal</button>

          <div id="myModal" class="modal">
            <div class="modal-content">
              <h3>Select Options</h3>
              <select id="modalDropdown">
                <option value="opt1">Option 1</option>
                <option value="opt2">Option 2</option>
                <option value="opt3">Option 3</option>
              </select>
              <button id="closeModal">Close</button>
            </div>
          </div>

          <script>
            document.getElementById('openModal').onclick = function() {
              document.getElementById('myModal').classList.add('show');
            };
            document.getElementById('closeModal').onclick = function() {
              document.getElementById('myModal').classList.remove('show');
            };
          </script>
        </body>
      </html>
    `);

    // Open modal
    await page.locator('#openModal').click();

    // Wait for modal to be visible
    await expect(page.locator('#myModal')).toHaveClass(/show/);

    // Select from dropdown in modal
    await page.locator('#modalDropdown').selectOption('opt2');

    // Verify selection
    expect(await page.locator('#modalDropdown').inputValue()).toBe('opt2');

    // Close modal
    await page.locator('#closeModal').click();
  });
});
