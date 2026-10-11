const { chromium } = require('playwright');
const LinkedinPage = require('./src/pages/LinkedinPage');
const DataRead = require('./src/utils/dataRead');
const DataConfig = require('./src/utils/DataConfig');

(async () => {
    console.log('Starting LinkedIn Login and Search Test...\n');

    const browser = await chromium.launch({
        headless: false,
        args: ['--window-size=1280,800', '--window-position=100,50']
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    try {
        // Get test data
        const testDataArray = DataRead.getTestData();
        const testData = testDataArray[0]; // Use first user (Muttu)
        const data = testData.data;
        DataConfig.getInstance().setDatasetName(testData.name);

        console.log('📍 Navigating to LinkedIn...');
        await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');

        const linkedinPage = new LinkedinPage(page);

        console.log('🔐 Attempting login...');
        await linkedinPage.loginToLinkedIn(data);

        console.log('\n✅ Login successful!');
        console.log(`Current URL: ${page.url()}\n`);

        console.log('📋 Navigating to Jobs...');
        await linkedinPage.navigateToJobs();

        console.log('\n✅ Navigated to Jobs section!');
        console.log(`Current URL: ${page.url()}\n`);

        console.log('🔍 Searching for jobs...');
        await linkedinPage.searchForJobs(data);

        console.log('\n✅ Job search completed!');
        console.log(`Current URL: ${page.url()}\n`);

        console.log('⏳ Waiting 10 seconds so you can see the result...\n');
        await page.waitForTimeout(10000);

        console.log('🎉 Test completed successfully!\n');

    } catch (error) {
        console.log(`\n❌ Test failed: ${error.message}`);

        // Take screenshot for debugging
        try {
            await page.screenshot({ path: 'screenshots/error.png' });
            console.log('Screenshot saved to screenshots/error.png');
        } catch (e) {
            // Ignore screenshot errors
        }
    } finally {
        await browser.close();
    }
})();
