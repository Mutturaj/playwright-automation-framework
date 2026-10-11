const { test } = require('@playwright/test');
const LinkedinPage = require('../src/pages/LinkedinPage');
const DataRead = require('../src/utils/dataRead');
const DataConfig = require('../src/utils/DataConfig');

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create test for each dataset
for (const testDataObj of testDataArray) {
    const datasetName = testDataObj.name;
    const data = testDataObj.data;

    test.describe(`LinkedIn Job Application - ${datasetName}`, () => {
        let linkedinPage;
        let page;

        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to LinkedIn
            await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');
            linkedinPage = new LinkedinPage(page);
        });

        test.afterAll(async () => {
            if (page) {
                await page.close();
            }
        });

        test('Apply jobs from search', async () => {
            await linkedinPage.loginToLinkedIn(data);
            await linkedinPage.navigateToJobs();
            await linkedinPage.searchForJobs(data);
            await linkedinPage.applyForJobs(data);
        });

        test('Apply jobs from recommended collection', async () => {
            await page.goto('https://www.linkedin.com/jobs/collections/recommended/');
            await linkedinPage.applyForJobs(data);
        });

        test('Apply jobs from notifications', async () => {
            await linkedinPage.navigateToNotification();
            await linkedinPage.applyForJobs(data);
        });

        test('Sign out', async () => {
            await linkedinPage.SignedOut();
        });
    });
}
