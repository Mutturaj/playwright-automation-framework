import { BrowserContext, expect, Locator, Page } from '@playwright/test';
import LocatorsDetails from './LocatorsDetails';

class GenericMethods {
    /**
     * Wait for page to load completely
     */
    async waitForPageLoad(page: Page): Promise<void> {
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {
            console.log('Network idle timeout, continuing...');
        });
    }

    /**
     * Find element using locator details
     */
    async findElement(page: Page, locatorDetails: LocatorsDetails): Promise<Locator | null> {
        try {
            const locator = this.getLocatorFromDetails(page, locatorDetails);
            await locator.waitFor({ state: 'visible', timeout: 50000 });
            return locator;
        } catch (error) {
            console.log(`Element not found: ${locatorDetails.name}`);
            return null;
        }
    }

    /**
     * Find multiple elements using locator details
     */
    async findElements(page: Page, locatorDetails: LocatorsDetails): Promise<Locator | null> {
        try {
            const locator = this.getLocatorFromDetails(page, locatorDetails);
            const count = await locator.count();
            return count > 0 ? locator : null;
        } catch (error) {
            console.log(`Elements not found: ${locatorDetails.name}`);
            return null;
        }
    }

    /**
     * Check if element is present
     */
    async isElementPresent(page: Page, locatorDetails: LocatorsDetails): Promise<boolean> {
        try {
            const locator = this.getLocatorFromDetails(page, locatorDetails);
            const count = await locator.count();
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if element list is empty
     */
    isElementListEmpty(locator: Locator | null): boolean {
        return locator === null;
    }

    /**
     * Wait for element to be visible
     */
    async waitForElement(page: Page, locatorDetails: LocatorsDetails): Promise<Locator> {
        console.log(`Waiting for element: ${locatorDetails.value}`);
        const locator = this.getLocatorFromDetails(page, locatorDetails);
        await locator.waitFor({ state: 'visible', timeout: 50000 });
        return locator;
    }

    /**
     * Wait for element to be clickable
     */
    async waitForElementToBeClickable(page: Page, locatorDetails: LocatorsDetails): Promise<void> {
        const locator = this.getLocatorFromDetails(page, locatorDetails);
        await locator.waitFor({ state: 'visible', timeout: 20000 });
        await expect(locator).toBeEnabled({ timeout: 20000 });
    }

    /**
     * Click element
     */
    async clickElement(page: Page, locatorDetails: LocatorsDetails): Promise<void> {
        const locator = await this.waitForElement(page, locatorDetails);
        await locator.click();
    }

    /**
     * Send keys to element
     */
    async sendKeysToElement(page: Page, locatorDetails: LocatorsDetails, text: string): Promise<void> {
        const locator = await this.waitForElement(page, locatorDetails);
        await locator.click();
        await locator.clear();
        await locator.fill(text);
    }

    /**
     * Scroll to element
     */
    async scrollToElement(page: Page, locatorDetails: LocatorsDetails): Promise<void> {
        const locator = this.getLocatorFromDetails(page, locatorDetails);
        await locator.scrollIntoViewIfNeeded();
        console.log(`Scrolled to element: ${locatorDetails.name}`);
    }

    /**
     * Scroll to top of page
     */
    async scrollToTop(page: Page): Promise<void> {
        await page.evaluate(() => window.scrollTo(0, 0));
        console.log('Scrolled to the top of the page.');
    }

    /**
     * Execute JavaScript on element
     */
    async executeJavaScript(page: Page, script: string, locatorDetails: LocatorsDetails): Promise<void> {
        const locator = this.getLocatorFromDetails(page, locatorDetails);
        const element = await locator.elementHandle();
        if (element) {
            await page.evaluate(({ el, scriptText }: { el: any; scriptText: string }) => {
                eval(scriptText.replace('arguments[0]', 'el'));
            }, { el: element, scriptText: script });
        }
    }

    /**
     * Execute JavaScript on WebElement
     */
    async executeJavaScriptOnElement(page: Page, script: string, element: any): Promise<void> {
        await page.evaluate(({ el, scriptText }: { el: any; scriptText: string }) => {
            const func = new Function('arguments', scriptText);
            func([el]);
        }, { el: element, scriptText: script });
    }

    /**
     * Select dropdown by index
     */
    async selectByIndex(page: Page, locatorDetails: LocatorsDetails, index: number): Promise<void> {
        const locator = await this.waitForElement(page, locatorDetails);
        await locator.selectOption({ index: index });
    }

    /**
     * Select dropdown by value
     */
    async selectByValue(page: Page, locatorDetails: LocatorsDetails, value: string): Promise<void> {
        const locator = await this.waitForElement(page, locatorDetails);
        await locator.selectOption({ value: value });
    }

    /**
     * Switch to tab by index
     */
    async switchToTabByIndex(context: BrowserContext, tabIndex: number): Promise<void> {
        const pages = context.pages();
        if (tabIndex >= 0 && tabIndex < pages.length) {
            await pages[tabIndex].bringToFront();
            await this.waitForPageLoad(pages[tabIndex]);
        } else {
            throw new Error(`Invalid tab index: ${tabIndex}`);
        }
    }

    /**
     * Get locator from details
     */
    getLocatorFromDetails(page: Page, locatorDetails: LocatorsDetails): Locator {
        switch (locatorDetails.type.toLowerCase()) {
            case 'id':
                return page.locator(`#${locatorDetails.value}`);
            case 'name':
                return page.locator(`[name="${locatorDetails.value}"]`);
            case 'xpath':
                return page.locator(locatorDetails.value);
            case 'classname':
                return page.locator(`.${locatorDetails.value}`);
            case 'cssselector':
                return page.locator(locatorDetails.value);
            default:
                throw new Error(`Unsupported locator type: ${locatorDetails.type}`);
        }
    }
}

export default GenericMethods;
