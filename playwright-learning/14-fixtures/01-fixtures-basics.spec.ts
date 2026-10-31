import { test as base, expect } from '@playwright/test';

/**
 * Playwright Fixtures
 * IMPORTANT SDET Interview Topic ⭐⭐
 *
 * Fixtures are Playwright's way to:
 * - Set up test environment
 * - Share objects between tests
 * - Create reusable test logic
 * - Manage test isolation
 */

test.describe('Built-in Fixtures', () => {

  test('Using page fixture', async ({ page }) => {
    // 'page' is a built-in fixture
    // Playwright automatically creates and manages it
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    console.log('✅ page fixture used');
  });

  test('Using context fixture', async ({ context }) => {
    // 'context' is a browser context fixture
    // Can create multiple pages from it
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('https://playwright.dev/');
    await page2.goto('https://github.com/');

    console.log('Total pages in context:', context.pages().length);

    await page1.close();
    await page2.close();

    console.log('✅ context fixture used');
  });

  test('Using browser fixture', async ({ browser }) => {
    // 'browser' gives you access to the browser instance
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://playwright.dev/');
    console.log('Browser version:', browser.version());

    await context.close();

    console.log('✅ browser fixture used');
  });

  test('Using request fixture for API testing', async ({ request }) => {
    // 'request' fixture for API calls
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');

    console.log('✅ request fixture used');
  });

  test('Using multiple fixtures together', async ({ page, context, browser }) => {
    // You can use multiple fixtures in one test
    console.log('Browser:', browser.version());
    console.log('Context pages:', context.pages().length);

    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    console.log('✅ Multiple fixtures used together');
  });
});

// ====================
// CUSTOM FIXTURES
// ====================

/**
 * Example 1: Custom Page Fixture with Auto-Navigation
 */
type TodoPageFixtures = {
  todoPage: any;
};

const testWithTodoPage = base.extend<TodoPageFixtures>({
  todoPage: async ({ page }, use) => {
    // Setup: Navigate to TodoMVC
    await page.goto('https://demo.playwright.dev/todomvc');
    console.log('🎬 Setup: Navigated to TodoMVC');

    // Provide the page to the test
    await use(page);

    // Teardown: Clean up (optional)
    console.log('🧹 Teardown: Test completed');
  },
});

testWithTodoPage.describe('Custom TodoPage Fixture', () => {

  testWithTodoPage('Add todo using custom fixture', async ({ todoPage }) => {
    // Page is already at TodoMVC!
    await todoPage.locator('.new-todo').fill('Task from custom fixture');
    await todoPage.locator('.new-todo').press('Enter');

    await expect(todoPage.locator('.todo-list li')).toHaveCount(1);

    console.log('✅ Used custom todoPage fixture');
  });

  testWithTodoPage('Multiple todos with custom fixture', async ({ todoPage }) => {
    // Each test gets a fresh page at TodoMVC
    await todoPage.locator('.new-todo').fill('Task 1');
    await todoPage.locator('.new-todo').press('Enter');
    await todoPage.locator('.new-todo').fill('Task 2');
    await todoPage.locator('.new-todo').press('Enter');

    await expect(todoPage.locator('.todo-list li')).toHaveCount(2);

    console.log('✅ Used custom todoPage fixture with multiple todos');
  });
});

/**
 * Example 2: Custom Fixture with Test Data
 */
type TestDataFixtures = {
  testUser: { username: string; password: string; email: string };
};

const testWithData = base.extend<TestDataFixtures>({
  testUser: async ({}, use) => {
    // Setup: Create test data
    const user = {
      username: 'testuser_' + Date.now(),
      password: 'SecurePass123!',
      email: 'test_' + Date.now() + '@example.com'
    };

    console.log('🎬 Setup: Created test user:', user.username);

    // Provide test data to the test
    await use(user);

    // Teardown: Clean up user (in real scenario, call API to delete)
    console.log('🧹 Teardown: Cleaning up user:', user.username);
  },
});

testWithData.describe('Custom Test Data Fixture', () => {

  testWithData('Use test user data', async ({ testUser }) => {
    console.log('Username:', testUser.username);
    console.log('Email:', testUser.email);

    expect(testUser.username).toContain('testuser_');
    expect(testUser.email).toContain('@example.com');

    console.log('✅ Used testUser fixture');
  });
});

/**
 * Example 3: Logged-in User Fixture
 */
type AuthFixtures = {
  authenticatedPage: any;
};

const testWithAuth = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Perform login
    await page.setContent(`
      <html>
        <body>
          <form id="loginForm">
            <input type="text" id="username" />
            <input type="password" id="password" />
            <button type="submit">Login</button>
          </form>
          <div id="dashboard" style="display: none;">
            <h1>Welcome to Dashboard</h1>
          </div>
          <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
              e.preventDefault();
              const username = document.getElementById('username').value;
              const password = document.getElementById('password').value;
              if (username === 'admin' && password === 'password123') {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
              }
            });
          </script>
        </body>
      </html>
    `);

    // Perform login
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await page.locator('#dashboard').waitFor({ state: 'visible' });

    console.log('🎬 Setup: User logged in');

    // Provide authenticated page to test
    await use(page);

    // Teardown: Logout (optional)
    console.log('🧹 Teardown: User logged out');
  },
});

testWithAuth.describe('Authenticated User Fixture', () => {

  testWithAuth('Access dashboard as logged-in user', async ({ authenticatedPage }) => {
    // User is already logged in!
    await expect(authenticatedPage.locator('#dashboard')).toBeVisible();
    await expect(authenticatedPage.locator('h1')).toHaveText('Welcome to Dashboard');

    console.log('✅ Used authenticatedPage fixture');
  });

  testWithAuth('Another test with logged-in user', async ({ authenticatedPage }) => {
    // Each test gets a freshly logged-in session
    await expect(authenticatedPage.locator('#dashboard')).toBeVisible();

    console.log('✅ Fresh login for each test');
  });
});

/**
 * Example 4: API Client Fixture
 */
type ApiFixtures = {
  apiClient: {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
    baseURL: string;
  };
};

const testWithApi = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    // Setup: Create API client
    const client = {
      baseURL: 'https://jsonplaceholder.typicode.com',

      get: async (endpoint: string) => {
        const response = await request.get(client.baseURL + endpoint);
        return response.json();
      },

      post: async (endpoint: string, data: any) => {
        const response = await request.post(client.baseURL + endpoint, { data });
        return response.json();
      },
    };

    console.log('🎬 Setup: API client created');

    await use(client);

    console.log('🧹 Teardown: API client cleaned up');
  },
});

testWithApi.describe('API Client Fixture', () => {

  testWithApi('Get data using API client', async ({ apiClient }) => {
    const post = await apiClient.get('/posts/1');

    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    console.log('Post title:', post.title);

    console.log('✅ Used apiClient fixture for GET');
  });

  testWithApi('Post data using API client', async ({ apiClient }) => {
    const newPost = await apiClient.post('/posts', {
      title: 'Test Post',
      body: 'This is a test',
      userId: 1
    });

    expect(newPost).toHaveProperty('id');
    console.log('Created post ID:', newPost.id);

    console.log('✅ Used apiClient fixture for POST');
  });
});

/**
 * Example 5: Page Object Model as Fixture
 */
class TodoPage {
  constructor(private page: any) {}

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    await this.page.locator('.new-todo').fill(text);
    await this.page.locator('.new-todo').press('Enter');
  }

  async getTodoCount() {
    return await this.page.locator('.todo-list li').count();
  }

  async completeTodo(index: number) {
    await this.page.locator('.todo-list li').nth(index).locator('.toggle').check();
  }

  async getTodoText(index: number) {
    return await this.page.locator('.todo-list li').nth(index).locator('label').textContent();
  }
}

type TodoPomFixtures = {
  todoPageObject: TodoPage;
};

const testWithPOM = base.extend<TodoPomFixtures>({
  todoPageObject: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    console.log('🎬 Setup: TodoPage object created and navigated');

    await use(todoPage);

    console.log('🧹 Teardown: TodoPage test completed');
  },
});

testWithPOM.describe('Page Object Model as Fixture', () => {

  testWithPOM('Add todos using POM fixture', async ({ todoPageObject }) => {
    await todoPageObject.addTodo('Buy groceries');
    await todoPageObject.addTodo('Walk the dog');
    await todoPageObject.addTodo('Read a book');

    const count = await todoPageObject.getTodoCount();
    expect(count).toBe(3);

    const firstTodo = await todoPageObject.getTodoText(0);
    expect(firstTodo).toBe('Buy groceries');

    console.log('✅ Used POM fixture');
  });

  testWithPOM('Complete todos using POM fixture', async ({ todoPageObject }) => {
    await todoPageObject.addTodo('Task to complete');
    await todoPageObject.completeTodo(0);

    console.log('✅ Completed todo using POM fixture');
  });
});

/**
 * Example 6: Worker-Scoped Fixture (Shared Across Tests)
 */
type WorkerFixtures = {
  workerStorageState: string;
};

const testWithWorker = base.extend<{}, WorkerFixtures>({
  // Worker fixture - runs once per worker, shared across tests
  workerStorageState: [async ({ browser }, use) => {
    // This runs ONCE per worker
    const context = await browser.newContext();
    const page = await context.newPage();

    // Simulate login once
    console.log('🎬 WORKER SETUP: Performing login (once per worker)');
    await page.setContent('<h1>Login performed</h1>');

    // Save authentication state
    await context.storageState({ path: 'worker-auth.json' });

    await use('worker-auth.json');

    console.log('🧹 WORKER TEARDOWN: Cleaning up');
    await context.close();
  }, { scope: 'worker' }], // Worker scope!
});

testWithWorker.describe('Worker-Scoped Fixture', () => {

  testWithWorker('Test 1 - uses shared worker fixture', async ({ page }) => {
    console.log('Test 1 running');
    expect(true).toBe(true);
  });

  testWithWorker('Test 2 - uses shared worker fixture', async ({ page }) => {
    console.log('Test 2 running');
    expect(true).toBe(true);
  });

  testWithWorker('Test 3 - uses shared worker fixture', async ({ page }) => {
    console.log('Test 3 running');
    expect(true).toBe(true);
  });

  // Worker fixture runs ONCE, all three tests share it
});

/**
 * Example 7: Combining Multiple Custom Fixtures
 */
type CombinedFixtures = {
  testUser: { name: string; email: string };
  apiClient: { baseURL: string };
  loggedInPage: any;
};

const testWithMultipleFixtures = base.extend<CombinedFixtures>({
  testUser: async ({}, use) => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    await use(user);
  },

  apiClient: async ({}, use) => {
    const client = { baseURL: 'https://api.example.com' };
    await use(client);
  },

  loggedInPage: async ({ page, testUser }, use) => {
    // This fixture depends on testUser fixture!
    console.log('Logging in user:', testUser.name);
    await page.goto('https://playwright.dev/');
    await use(page);
  },
});

testWithMultipleFixtures.describe('Combined Fixtures', () => {

  testWithMultipleFixtures('Use multiple fixtures', async ({ testUser, apiClient, loggedInPage }) => {
    console.log('User:', testUser.name);
    console.log('API:', apiClient.baseURL);
    await expect(loggedInPage).toHaveTitle(/Playwright/);

    console.log('✅ Used multiple custom fixtures');
  });
});

/**
 * KEY INTERVIEW POINTS:
 *
 * 1. What are fixtures?
 *    - Way to set up and share test environment
 *    - Built-in: page, context, browser, request
 *    - Custom: Create your own
 *
 * 2. How to create custom fixture?
 *    const test = base.extend<FixtureType>({
 *      fixtureName: async ({}, use) => {
 *        // Setup
 *        await use(value);
 *        // Teardown
 *      }
 *    });
 *
 * 3. Fixture scope?
 *    - Test scope (default): Created for each test
 *    - Worker scope: Shared across tests in worker
 *
 * 4. Benefits?
 *    - Test isolation
 *    - Code reusability
 *    - Clean setup/teardown
 *    - Type safety
 *
 * 5. When to use fixtures vs hooks?
 *    - Fixtures: When you need to share objects/state
 *    - Hooks: For simple before/after operations
 */

test.describe('Fixture Best Practices', () => {

  test('Understanding fixture lifecycle', async ({ page }) => {
    /**
     * FIXTURE LIFECYCLE:
     *
     * 1. Setup phase (before 'use')
     *    - Create resources
     *    - Perform setup actions
     *
     * 2. Use phase (await use(value))
     *    - Test runs with the fixture
     *
     * 3. Teardown phase (after 'use')
     *    - Cleanup resources
     *    - Always runs, even if test fails
     */

    console.log('✅ Fixture lifecycle understanding');
    expect(true).toBe(true);
  });
});
