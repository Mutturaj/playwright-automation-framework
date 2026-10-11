const { test } = require('@playwright/test');
const NaukriPage = require('../src/pages/NaukriPage');
const DataRead = require('../src/utils/dataRead');
const DataConfig = require('../src/utils/DataConfig');

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create test for each dataset
for (const testDataObj of testDataArray) {
    const datasetName = testDataObj.name;
    const data = testDataObj.data;

    test.describe(`Naukri Job Application - ${datasetName}`, () => {
        let naukriPage;
        let page;

        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to Naukri
            await page.goto('https://www.naukri.com/nlogin/login');
            naukriPage = new NaukriPage(page);
        });

        test.afterAll(async () => {
            if (page) {
                await page.close();
            }
        });

        test('Login and update profile', async () => {
            await naukriPage.NaukriLogin(data);
            await naukriPage.NaukriUpdate();
        });

        test('Apply jobs from recommended', async () => {
            await naukriPage.JobApplyFrom_Recommended();
        });

        test('Apply jobs from search', async () => {
            await naukriPage.JobApplyFromSearch(data);
        });
    });
}
