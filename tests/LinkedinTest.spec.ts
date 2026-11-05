import { Browser, BrowserContext, Page, test } from '@playwright/test';
import { LinkedinPage } from '../src/pages/LinkedinPage';
import DataConfig from '../src/utils/DataConfig';
import DataRead from '../src/utils/dataRead';

/**
 * LinkedIn Job Application Tests (TypeScript)
 * Automated job application on LinkedIn
 *
 * Run configuration:
 * - When run from IDE: Opens browser in headed mode
 * - When run from CLI: Uses playwright.config.js settings
 */

// Configure test to run in headed mode when run from IDE
test.use({
    headless: false,  // Always show browser
    launchOptions: {
        slowMo: 100   // Slow down operations by 100ms for better visibility
    },
    video: 'retain-on-failure',  // Record video on failure
    screenshot: 'only-on-failure'  // Take screenshot on failure
});

// Get test data from dataset.json - using first dataset only
const testDataArray = DataRead.getTestData();
const testDataObj = testDataArray[0]; // Use only the first dataset
const datasetName: string = testDataObj.name;
const data: string[] = testDataObj.data;

test.describe(`LinkedIn Job Application - ${datasetName}`, () => {
    let linkedinPage: LinkedinPage;
    let page: Page;
    let context: BrowserContext;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        // Create browser context with natural window size
        context = await browser.newContext();
        page = await context.newPage();

        // Set dataset name for this test suite
        DataConfig.getInstance().setDatasetName(datasetName);

        // Navigate to LinkedIn
        await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');

        // Initialize LinkedIn Page Object
        linkedinPage = new LinkedinPage(page);

        console.log(`✅ Initialized LinkedIn test suite: ${datasetName}`);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
            console.log('🧹 Closed page');
        }
        if (context) {
            await context.close();
            console.log('🧹 Closed browser context');
        }
    });

    test('Apply jobs from search', async () => {
        console.log('🔐 Logging into LinkedIn...');
        await linkedinPage.loginToLinkedIn(data);

        console.log('📍 Navigating to Jobs section...');
        await linkedinPage.navigateToJobs();

        console.log('🔍 Searching for jobs...');
        await linkedinPage.searchForJobs(data);

        console.log('📝 Applying for jobs...');
        await linkedinPage.applyForJobs(data);

        console.log('✅ Completed job search and applications');
    });

    test('Apply jobs from recommended collection', async () => {
        console.log('🔐 Logging into LinkedIn...');
        await linkedinPage.loginToLinkedIn(data);
        
        console.log('📍 Navigating to recommended jobs...');
        await page.goto('https://www.linkedin.com/jobs/collections/recommended/');

        console.log('📝 Applying for recommended jobs...');
        await linkedinPage.applyForJobs(data);

        console.log('✅ Completed recommended job applications');
    });

    test('Apply jobs from notifications', async () => {
        console.log('🔔 Navigating to notifications...');
        await linkedinPage.navigateToNotification();

        console.log('📝 Applying for jobs from notifications...');
        await linkedinPage.applyForJobs(data);

        console.log('✅ Completed notification job applications');
    });

    test('Sign out', async () => {
        console.log('🚪 Signing out from LinkedIn...');
        await linkedinPage.SignedOut();
        console.log('✅ Successfully signed out');
    });
});
