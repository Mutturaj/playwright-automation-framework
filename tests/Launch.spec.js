const {expect} = require('@playwright/test');
const {test} = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://www.flipkart.com/account/login?ret=/'); 
  await expect(page).toHaveTitle(/Flipkart/);
  await page.click('//input[@placeholder="Search for products, brands and more"]');
  await page.fill('//input[@placeholder="Search for products, brands and more"]', 'Moto');
 // await page.press('input[placeholder*="Search"]', 'Enter');
  await page.waitForTimeout(5000);
  const sugestionslist=await page.$$('//div[@class="pVNZxj KIiP4i"]');
  console.log(sugestionslist.length);
  for(let i=0;i<sugestionslist.length;i++){
    await page.waitForTimeout(1000);
    const text=await sugestionslist[i].textContent();
    console.log(`Suggestion ${i + 1}: ${text.trim()}`);
  }
  sugestionslist[1].click();
  console.log("clicked on moto g31");
  await page.screenshot({ path: 'screenshot.png' });
  await page.close();
});