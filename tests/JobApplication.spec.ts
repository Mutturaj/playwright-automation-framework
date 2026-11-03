import { test, Browser, Page, BrowserContext } from '@playwright/test';
import LinkedinPage from '../src/pages/LinkedinPage';
import NaukriPage from '../src/pages/NaukriPage';
import DataRead from '../src/utils/dataRead';
import DataConfig from '../src/utils/DataConfig';

/**
 * Combined Job Application Tests (TypeScript)
 * Runs LinkedIn and Naukri tests in parallel for faster execution
 */

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create parallel tests for each dataset (LinkedIn and Naukri run in parallel)
for (const testDataObj of testDataArray) {
    const datasetName: string = testDataObj.name;
    const data: string[] = testDataObj.data;

    // LinkedIn Test Suite
    test.describe.parallel(`LinkedIn - ${datasetName}`, () => {
        let linkedinPage: LinkedinPage;
        let page: Page;
        let context: BrowserContext;

        test.beforeAll(async ({ browser }: { browser: Browser }) => {
            context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to LinkedIn
            await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');
            linkedinPage = new LinkedinPage(page);

            console.log(`✅ Initialized LinkedIn parallel test: ${datasetName}`);
        });

        test.afterAll(async () => {
            if (context) {
                await context.close();
                console.log(`🧹 Closed LinkedIn context for: ${datasetName}`);
            }
        });

        test(`${datasetName} - LinkedIn Login and Search Jobs`, async () => {
            console.log('🔐 LinkedIn: Logging in...');
            await linkedinPage.loginToLinkedIn(data);

            console.log('📍 LinkedIn: Navigating to Jobs...');
            await linkedinPage.navigateToJobs();

            console.log('🔍 LinkedIn: Searching for jobs...');
            await linkedinPage.searchForJobs(data);

            console.log('📝 LinkedIn: Applying for jobs...');
            await linkedinPage.applyForJobs(data);

            console.log('✅ LinkedIn: Search and apply completed');
        });

        test(`${datasetName} - LinkedIn Recommended Jobs`, async () => {
            console.log('📍 LinkedIn: Navigating to recommended jobs...');
            await page.goto('https://www.linkedin.com/jobs/collections/recommended/');

            console.log('📝 LinkedIn: Applying for recommended jobs...');
            await linkedinPage.applyForJobs(data);

            console.log('✅ LinkedIn: Recommended jobs completed');
        });

        test(`${datasetName} - LinkedIn Notifications`, async () => {
            console.log('🔔 LinkedIn: Checking notifications...');
            await linkedinPage.navigateToNotification();

            console.log('📝 LinkedIn: Applying for jobs from notifications...');
            await linkedinPage.applyForJobs(data);

            console.log('✅ LinkedIn: Notification jobs completed');
        });

        test(`${datasetName} - LinkedIn Sign Out`, async () => {
            console.log('🚪 LinkedIn: Signing out...');
            await linkedinPage.SignedOut();
            console.log('✅ LinkedIn: Sign out completed');
        });
    });

    // Naukri Test Suite (runs in parallel with LinkedIn)
    test.describe.parallel(`Naukri - ${datasetName}`, () => {
        let naukriPage: NaukriPage;
        let page: Page;
        let context: BrowserContext;

        test.beforeAll(async ({ browser }: { browser: Browser }) => {
            context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to Naukri
            await page.goto('https://www.naukri.com/nlogin/login');
            naukriPage = new NaukriPage(page);

            console.log(`✅ Initialized Naukri parallel test: ${datasetName}`);
        });

        test.afterAll(async () => {
            if (context) {
                await context.close();
                console.log(`🧹 Closed Naukri context for: ${datasetName}`);
            }
        });

        test(`${datasetName} - Naukri Login and Update`, async () => {
            console.log('🔐 Naukri: Logging in...');
            await naukriPage.NaukriLogin(data);

            console.log('📝 Naukri: Updating profile...');
            await naukriPage.NaukriUpdate();

            console.log('✅ Naukri: Login and update completed');
        });

        test(`${datasetName} - Naukri Recommended Jobs`, async () => {
            console.log('🔍 Naukri: Applying for recommended jobs...');
            await naukriPage.JobApplyFrom_Recommended();
            console.log('✅ Naukri: Recommended jobs completed');
        });

        test(`${datasetName} - Naukri Search Jobs`, async () => {
            console.log('🔍 Naukri: Searching and applying for jobs...');
            await naukriPage.JobApplyFromSearch(data);
            console.log('✅ Naukri: Search jobs completed');
        });
    });
}
