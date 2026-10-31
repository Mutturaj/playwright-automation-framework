import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';

/**
 * Advanced Fixtures Patterns
 * Real-world fixture examples for SDET interviews
 */

/**
 * Pattern 1: Database Connection Fixture
 */
type DatabaseFixtures = {
  db: {
    connect: () => void;
    disconnect: () => void;
    query: (sql: string) => Promise<any>;
    isConnected: boolean;
  };
};

const testWithDatabase = base.extend<DatabaseFixtures>({
  db: async ({}, use) => {
    // Setup: Create database connection
    const database = {
      isConnected: false,

      connect: function() {
        console.log('🔌 Connecting to database...');
        this.isConnected = true;
      },

      disconnect: function() {
        console.log('🔌 Disconnecting from database...');
        this.isConnected = false;
      },

      query: async function(sql: string) {
        if (!this.isConnected) {
          throw new Error('Database not connected');
        }
        console.log('📊 Executing query:', sql);
        return { rows: [], count: 0 };
      }
    };

    database.connect();

    await use(database);

    // Teardown: Always disconnect
    database.disconnect();
  },
});

testWithDatabase.describe('Database Fixture', () => {

  testWithDatabase('Query database using fixture', async ({ db }) => {
    expect(db.isConnected).toBe(true);

    const result = await db.query('SELECT * FROM users WHERE id = 1');
    expect(result).toHaveProperty('rows');

    console.log('✅ Database fixture used');
  });
});

/**
 * Pattern 2: Screenshot Fixture (Auto-screenshot on failure)
 */
type ScreenshotFixtures = {
  autoScreenshot: void;
};

const testWithAutoScreenshot = base.extend<ScreenshotFixtures>({
  autoScreenshot: [async ({ page }, use, testInfo) => {
    await use();

    // After test runs, check if it failed
    if (testInfo.status === 'failed') {
      const screenshotPath = `screenshots/failed-${testInfo.title.replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('📸 Failure screenshot saved:', screenshotPath);
    }
  }, { auto: true }], // Auto: true means this runs for every test automatically
});

testWithAutoScreenshot.describe('Auto Screenshot on Failure', () => {

  testWithAutoScreenshot('This test will pass', async ({ page, autoScreenshot }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    console.log('✅ Test passed, no screenshot taken');
  });

  // Uncomment to test failure screenshot
  // testWithAutoScreenshot('This test will fail', async ({ page, autoScreenshot }) => {
  //   await page.goto('https://playwright.dev/');
  //   await expect(page).toHaveTitle(/NonExistentTitle/); // This will fail
  // });
});

/**
 * Pattern 3: Test Data Seeding Fixture
 */
type DataSeedFixtures = {
  seededData: {
    users: Array<{ id: number; name: string; email: string }>;
    posts: Array<{ id: number; title: string; userId: number }>;
  };
};

const testWithSeededData = base.extend<DataSeedFixtures>({
  seededData: async ({}, use) => {
    // Setup: Seed test data
    console.log('🌱 Seeding test data...');

    const data = {
      users: [
        { id: 1, name: 'Alice', email: 'alice@test.com' },
        { id: 2, name: 'Bob', email: 'bob@test.com' },
        { id: 3, name: 'Charlie', email: 'charlie@test.com' },
      ],
      posts: [
        { id: 1, title: 'First Post', userId: 1 },
        { id: 2, title: 'Second Post', userId: 2 },
      ],
    };

    // In real scenario: Insert into database
    // await db.insertMany('users', data.users);
    // await db.insertMany('posts', data.posts);

    await use(data);

    // Teardown: Clean up test data
    console.log('🧹 Cleaning up test data...');
    // await db.deleteMany('users', { email: { $like: '%@test.com' } });
  },
});

testWithSeededData.describe('Test Data Seeding', () => {

  testWithSeededData('Use seeded data', async ({ seededData }) => {
    expect(seededData.users).toHaveLength(3);
    expect(seededData.posts).toHaveLength(2);

    const alice = seededData.users.find(u => u.name === 'Alice');
    expect(alice?.email).toBe('alice@test.com');

    console.log('✅ Seeded data used');
  });
});

/**
 * Pattern 4: Mock API Server Fixture
 */
type MockServerFixtures = {
  mockApi: {
    baseURL: string;
    addMock: (endpoint: string, response: any) => void;
    getMock: (endpoint: string) => any;
  };
};

const testWithMockApi = base.extend<MockServerFixtures>({
  mockApi: async ({ page }, use) => {
    // Setup: Create mock API
    const mocks = new Map();

    const mockApi = {
      baseURL: 'https://mock-api.example.com',

      addMock: (endpoint: string, response: any) => {
        mocks.set(endpoint, response);
        console.log('🎭 Added mock for:', endpoint);
      },

      getMock: (endpoint: string) => {
        return mocks.get(endpoint);
      },
    };

    // Intercept API calls and return mocked responses
    await page.route('**/api/**', route => {
      const url = route.request().url();
      const endpoint = url.split('/api')[1];

      if (mocks.has(endpoint)) {
        console.log('🎭 Returning mocked response for:', endpoint);
        route.fulfill({
          status: 200,
          body: JSON.stringify(mocks.get(endpoint)),
        });
      } else {
        route.continue();
      }
    });

    await use(mockApi);

    // Teardown
    console.log('🧹 Mock API cleaned up');
  },
});

testWithMockApi.describe('Mock API Server', () => {

  testWithMockApi('Use mocked API responses', async ({ page, mockApi }) => {
    // Setup mock responses
    mockApi.addMock('/users', {
      users: [
        { id: 1, name: 'Mocked User 1' },
        { id: 2, name: 'Mocked User 2' }
      ]
    });

    await page.setContent(`
      <html>
        <body>
          <button id="loadUsers">Load Users</button>
          <div id="users"></div>
          <script>
            document.getElementById('loadUsers').addEventListener('click', async function() {
              const response = await fetch('/api/users');
              const data = await response.json();
              document.getElementById('users').textContent = JSON.stringify(data);
            });
          </script>
        </body>
      </html>
    `);

    await page.click('#loadUsers');
    await page.waitForTimeout(500);

    const usersText = await page.locator('#users').textContent();
    expect(usersText).toContain('Mocked User 1');

    console.log('✅ Mock API fixture used');
  });
});

/**
 * Pattern 5: Performance Measurement Fixture
 */
type PerformanceFixtures = {
  performance: {
    startTime: number;
    getElapsedTime: () => number;
  };
};

const testWithPerformance = base.extend<PerformanceFixtures>({
  performance: async ({}, use, testInfo) => {
    const startTime = Date.now();

    const perf = {
      startTime,
      getElapsedTime: () => Date.now() - startTime,
    };

    console.log('⏱️ Performance measurement started');

    await use(perf);

    const duration = Date.now() - startTime;
    console.log(`⏱️ Test "${testInfo.title}" took ${duration}ms`);

    // Can add assertions on performance
    if (duration > 10000) {
      console.warn('⚠️ Test took longer than 10 seconds!');
    }
  },
});

testWithPerformance.describe('Performance Measurement', () => {

  testWithPerformance('Measure test performance', async ({ page, performance }) => {
    await page.goto('https://playwright.dev/');

    const elapsed = performance.getElapsedTime();
    console.log(`Elapsed time: ${elapsed}ms`);

    expect(elapsed).toBeGreaterThan(0);

    console.log('✅ Performance measured');
  });
});

/**
 * Pattern 6: Environment Config Fixture
 */
type EnvFixtures = {
  env: {
    baseURL: string;
    apiURL: string;
    environment: 'dev' | 'staging' | 'prod';
    timeout: number;
  };
};

const testWithEnv = base.extend<EnvFixtures>({
  env: async ({}, use) => {
    // Setup: Load environment configuration
    const environment = (process.env.TEST_ENV || 'dev') as 'dev' | 'staging' | 'prod';

    const configs = {
      dev: {
        baseURL: 'http://localhost:3000',
        apiURL: 'http://localhost:8080/api',
        timeout: 30000,
      },
      staging: {
        baseURL: 'https://staging.example.com',
        apiURL: 'https://api-staging.example.com',
        timeout: 60000,
      },
      prod: {
        baseURL: 'https://example.com',
        apiURL: 'https://api.example.com',
        timeout: 90000,
      },
    };

    const config = {
      ...configs[environment],
      environment,
    };

    console.log('🌍 Environment:', environment);
    console.log('🔗 Base URL:', config.baseURL);

    await use(config);
  },
});

testWithEnv.describe('Environment Configuration', () => {

  testWithEnv('Use environment config', async ({ env }) => {
    console.log('Testing on environment:', env.environment);
    console.log('API URL:', env.apiURL);
    console.log('Timeout:', env.timeout);

    expect(env.baseURL).toBeDefined();
    expect(env.apiURL).toBeDefined();

    console.log('✅ Environment fixture used');
  });
});

/**
 * Pattern 7: Browser Context with Cookies/Storage Fixture
 */
type AuthContextFixtures = {
  authenticatedContext: any;
};

const testWithAuthContext = base.extend<AuthContextFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    // Setup: Create context with authentication
    const context = await browser.newContext({
      storageState: {
        cookies: [
          {
            name: 'session_id',
            value: 'abc123xyz',
            domain: '.example.com',
            path: '/',
            expires: Date.now() / 1000 + 86400,
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
          },
        ],
        origins: [
          {
            origin: 'https://example.com',
            localStorage: [
              { name: 'user_id', value: '12345' },
              { name: 'auth_token', value: 'token_abc123' },
            ],
          },
        ],
      },
    });

    console.log('🔐 Authenticated context created');

    await use(context);

    // Teardown
    await context.close();
    console.log('🧹 Authenticated context closed');
  },
});

testWithAuthContext.describe('Authenticated Context', () => {

  testWithAuthContext('Use authenticated context', async ({ authenticatedContext }) => {
    const page = await authenticatedContext.newPage();

    await page.setContent(`
      <html>
        <body>
          <h1>Dashboard</h1>
          <div id="userId"></div>
          <script>
            document.getElementById('userId').textContent =
              'User ID: ' + localStorage.getItem('user_id');
          </script>
        </body>
      </html>
    `);

    const userIdText = await page.locator('#userId').textContent();
    expect(userIdText).toContain('12345');

    await page.close();

    console.log('✅ Authenticated context used');
  });
});

/**
 * Pattern 8: Dependency Injection with Fixtures
 */
class Logger {
  logs: string[] = [];

  log(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

type LoggerFixtures = {
  logger: Logger;
};

const testWithLogger = base.extend<LoggerFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger();
    logger.log(`Starting test: ${testInfo.title}`);

    await use(logger);

    logger.log(`Test completed: ${testInfo.status}`);
    console.log('Total logs:', logger.getLogs().length);
  },
});

testWithLogger.describe('Dependency Injection', () => {

  testWithLogger('Use injected logger', async ({ logger, page }) => {
    logger.log('Navigating to Playwright website');
    await page.goto('https://playwright.dev/');

    logger.log('Checking page title');
    await expect(page).toHaveTitle(/Playwright/);

    logger.log('Test assertions passed');

    expect(logger.getLogs().length).toBeGreaterThan(0);

    console.log('✅ Logger fixture used');
  });
});

/**
 * KEY INTERVIEW POINTS FOR ADVANCED FIXTURES:
 *
 * 1. Fixtures vs Hooks?
 *    - Fixtures: Share objects, dependency injection, type-safe
 *    - Hooks: Simple setup/teardown, less flexible
 *
 * 2. Worker scope vs Test scope?
 *    - Worker: Shared across all tests in worker (expensive setup)
 *    - Test: Fresh for each test (isolated, safe)
 *
 * 3. Auto fixtures?
 *    - { auto: true } - Runs automatically for every test
 *    - Useful for: logging, screenshots, cleanup
 *
 * 4. Fixture dependencies?
 *    - Fixtures can depend on other fixtures
 *    - Playwright resolves dependency graph automatically
 *
 * 5. Best practices?
 *    - Keep fixtures focused (single responsibility)
 *    - Use descriptive names
 *    - Always clean up in teardown
 *    - Prefer fixtures over global state
 */
