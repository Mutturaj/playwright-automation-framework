import { test, Browser, Page, BrowserContext } from '@playwright/test';
import {LinkedinPage} from '../src/pages/LinkedinPage';
import DataRead from '../src/utils/dataRead';
import DataConfig from '../src/utils/DataConfig';

/**
 * LinkedIn Job Application Tests (TypeScript)
 * Automated job application on LinkedIn
 */

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create test for each dataset
for (const testDataObj of testDataArray) {
    const datasetName: string = testDataObj.name;
    const data: string[] = testDataObj.data;

    test.describe(`LinkedIn Job Application - ${datasetName}`, () => {
        let linkedinPage: LinkedinPage;
        let page: Page;
        let context: BrowserContext;

        test.beforeAll(async ({ browser }: { browser: Browser }) => {
            // Create browser context with custom viewport
            context = await browser.newContext({
                viewport: { width: 1920, height: 1080 }
            });
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
}
