import { test, Browser, Page, BrowserContext } from '@playwright/test';
import {NaukriPage} from '../src/pages/NaukriPage';
import DataRead from '../src/utils/dataRead';
import DataConfig from '../src/utils/DataConfig';

/**
 * Naukri Job Application Tests (TypeScript)
 * Automated job application on Naukri.com
 */

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create test for each dataset
for (const testDataObj of testDataArray) {
    const datasetName: string = testDataObj.name;
    const data: string[] = testDataObj.data;

    test.describe.serial(`Naukri Job Application - ${datasetName}`, () => {
        let naukriPage: NaukriPage;
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

            // Navigate to Naukri login page
            await page.goto('https://www.naukri.com/nlogin/login');

            // Initialize Naukri Page Object
            naukriPage = new NaukriPage(page);

            console.log(`✅ Initialized Naukri test suite: ${datasetName}`);
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

        test('Login and update profile', async () => {
            console.log('🔐 Logging into Naukri...');
            await naukriPage.NaukriLogin(data);

            console.log('📝 Updating Naukri profile...');
            await naukriPage.NaukriUpdate();

            console.log('✅ Login and profile update completed');
        });

        test('Apply jobs from recommended', async () => {
            console.log('🔍 Applying for recommended jobs...');
            await naukriPage.JobApplyFrom_Recommended();
            console.log('✅ Completed applying to recommended jobs');
        });

        test('Apply jobs from search', async () => {
            console.log('🔍 Searching and applying for jobs...');
            await naukriPage.JobApplyFromSearch(data);
            console.log('✅ Completed job search and applications');
        });
    });
}
