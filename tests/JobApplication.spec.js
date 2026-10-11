const { test } = require('@playwright/test');
const LinkedinPage = require('../src/pages/LinkedinPage');
const NaukriPage = require('../src/pages/NaukriPage');
const DataRead = require('../src/utils/dataRead');
const DataConfig = require('../src/utils/DataConfig');

// Get test data from dataset.json
const testDataArray = DataRead.getTestData();

// Create parallel tests for each dataset (LinkedIn and Naukri run in parallel)
for (const testDataObj of testDataArray) {
    const datasetName = testDataObj.name;
    const data = testDataObj.data;

    // LinkedIn Test Suite
    test.describe.parallel(`LinkedIn - ${datasetName}`, () => {
        let linkedinPage;
        let page;
        let context;

        test.beforeAll(async ({ browser }) => {
            context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to LinkedIn
            await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');
            linkedinPage = new LinkedinPage(page);
        });

        test.afterAll(async () => {
            if (context) {
                await context.close();
            }
        });

        test(`${datasetName} - LinkedIn Login and Search Jobs`, async () => {
            await linkedinPage.loginToLinkedIn(data);
            await linkedinPage.navigateToJobs();
            await linkedinPage.searchForJobs(data);
            await linkedinPage.applyForJobs(data);
        });

        test(`${datasetName} - LinkedIn Recommended Jobs`, async () => {
            await page.goto('https://www.linkedin.com/jobs/collections/recommended/');
            await linkedinPage.applyForJobs(data);
        });

        test(`${datasetName} - LinkedIn Notifications`, async () => {
            await linkedinPage.navigateToNotification();
            await linkedinPage.applyForJobs(data);
        });

        test(`${datasetName} - LinkedIn Sign Out`, async () => {
            await linkedinPage.SignedOut();
        });
    });

    // Naukri Test Suite (runs in parallel with LinkedIn)
    test.describe.parallel(`Naukri - ${datasetName}`, () => {
        let naukriPage;
        let page;
        let context;

        test.beforeAll(async ({ browser }) => {
            context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            page = await context.newPage();

            // Set dataset name for this test
            DataConfig.getInstance().setDatasetName(datasetName);

            // Navigate to Naukri
            await page.goto('https://www.naukri.com/nlogin/login');
            naukriPage = new NaukriPage(page);
        });

        test.afterAll(async () => {
            if (context) {
                await context.close();
            }
        });

        test(`${datasetName} - Naukri Login and Update`, async () => {
            await naukriPage.NaukriLogin(data);
            await naukriPage.NaukriUpdate();
        });

        test(`${datasetName} - Naukri Recommended Jobs`, async () => {
            await naukriPage.JobApplyFrom_Recommended();
        });

        test(`${datasetName} - Naukri Search Jobs`, async () => {
            await naukriPage.JobApplyFromSearch(data);
        });
    });
}
