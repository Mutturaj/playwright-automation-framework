const { test } = require('@playwright/test');

test("Sample Test", async ({ page }) => {
  console.log("This is a sample test");
  await page.goto("https://www.flipkart.com/");
  await page.waitForTimeout(2000);
  await page.click("//span[@role='button']");
  await page.waitForTimeout(1000);
 // await page.fill("","");
  await page.waitForTimeout(1000);
  await page.locator("//a[@aria-label='Instagram']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.click("//a[@aria-label='Instagram']");
  await page.waitForTimeout(2000);
  await page.goBack();
  await page.waitForTimeout(2000);
  await page.click("//a[@aria-label='Facebook']");
  await page.waitForTimeout(2000);
  await page.goBack();
  await page.waitForTimeout(2000);
  await page.click("//a[@aria-label='Twitter']");
  await page.waitForTimeout(2000);
  await page.goBack();
  await page.waitForTimeout(2000);
  await page.click("//a[@aria-label='YouTube']");
  await page.waitForTimeout(2000);
  await page.goBack();
  await page.waitForTimeout(2000);
  await page.on('dialog', async dialog => {   
    dialog.dismiss(); // Dismiss the alert
  });
  await page.click("//a[@aria-label='LinkedIn']");
  await page.waitForTimeout(2000);
  await page.locator("//a[@aria-label='LinkedIn']").fill('https://www.linkedin.com/company/flipkart/');

});
