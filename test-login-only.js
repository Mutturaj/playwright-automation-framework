const { chromium } = require('@playwright/test');
const LinkedinPage = require('./src/pages/LinkedinPage');
const DataConfig = require('./src/utils/DataConfig');

(async () => {
    console.log('🚀 Starting LinkedIn Login Test...\n');

    const browser = await chromium.launch({
        headless: false,
        args: [
            '--window-size=1280,800',
            '--window-position=100,50'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    try {
        // Set dataset for Muttu
        DataConfig.getInstance().setDatasetName('Muttu');

        // Test data
        const data = [
            'mutturaja1996@gmail.com',  // Email
            '15Muttu@05',               // Password
            'SDET OR QA Engineer Easy Apply',  // LinkedIn job title
            'sdet software test engineer',     // Naukri job title
            'Karnataka, India',          // Location
            '3',                        // Experience
            'Hi, Please find my resume'  // Message
        ];

        // Navigate to LinkedIn
        console.log('📍 Navigating to LinkedIn...');
        await page.goto('https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit');

        // Create LinkedIn page instance
        const linkedinPage = new LinkedinPage(page);

        // Login
        console.log('🔐 Attempting login...');
        await linkedinPage.loginToLinkedIn(data);

        console.log('\n✅ Login successful!');
        console.log(`Current URL: ${page.url()}`);

        // Wait to see the result
        console.log('\n⏳ Waiting 10 seconds so you can see the result...');
        await page.waitForTimeout(10000);

        console.log('\n🎉 Test completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        await page.screenshot({ path: 'screenshots/error.png' });
        console.log('Screenshot saved to screenshots/error.png');
    } finally {
        await browser.close();
    }
})();
