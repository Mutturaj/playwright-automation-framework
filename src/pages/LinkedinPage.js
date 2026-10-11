const GenericMethods = require('../utils/GenericMethods');
const LinkedinLocators = require('../locators/LinkedinLocators');
const QuestionAnswerHandler = require('../utils/QuestionAnswerHandler');
const DataConfig = require('../utils/DataConfig');

class LinkedinPage extends GenericMethods {
    constructor(page) {
        super();
        this.page = page;
        this.locators = new LinkedinLocators();
        const datasetName = DataConfig.getInstance().getDatasetName();
        this.questionAnswerHandler = new QuestionAnswerHandler(datasetName);
        this.appliedJobsCount = 0;
    }

    async loginToLinkedIn(data) {
        console.log('\n=== Starting LinkedIn Login ===');
        console.log(`Attempting to login with email: ${data[0]}`);

        try {
            // Wait for page to load
            await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
                console.log('Network idle timeout, continuing...');
            });
            await this.page.waitForTimeout(3000);

            // Check if already logged in
            const currentUrl = this.page.url();
            if (currentUrl.includes('/feed') && !currentUrl.includes('/login')) {
                console.log('✓ Already logged in, skipping login');
                return;
            }

            // Fill email using exact XPath
            console.log('Entering email...');
            const emailInput = await this.page.locator('(//input[@type="email"])[2]').first();
            await emailInput.fill(data[0]);
            console.log('✓ Email entered');

            // Fill password using exact XPath
            console.log('Entering password...');
            const passwordInput = await this.page.locator('(//input[@type="password"])[2]').first();
            await passwordInput.fill(data[1]);
            console.log('✓ Password entered');

            // Click Sign In button using exact XPath
            console.log('Clicking Sign In button...');
            const signInButton = await this.page.locator('(//button[@type="button"]//span[.="Sign in"])[4]').first();
            await signInButton.click();
            console.log('✓ Sign In button clicked');

            // Wait for navigation after login
            await this.page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {
                console.log('Network idle timeout during login, continuing...');
            });
            await this.page.waitForTimeout(500);

            console.log('=== Login Process Completed ===');
            console.log(`Current URL after login: ${this.page.url()}\n`);

        } catch (error) {
            console.log('\n=== DEBUG INFO ON ERROR ===');
            console.log(`Current URL: ${this.page.url()}`);
            console.log(`Page Title: ${await this.page.title()}`);

            // Take a screenshot for debugging
            await this.page.screenshot({ path: 'screenshots/login-error.png' }).catch(() => {});

            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async navigateToJobs() {
        await this.waitForPageLoad(this.page);
        console.log('=== Navigating to Jobs ===');
        await this.page.goto('https://www.linkedin.com/jobs/');
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(500);
    }

    async navigateToNotification() {
        await this.waitForPageLoad(this.page);
        const notificationIcon = await this.findElement(this.page, this.locators.NotificationIcon);
        if (notificationIcon) {
            await notificationIcon.click();
            await this.waitForPageLoad(this.page);
            await this.page.waitForTimeout(1000);

            const viewJobsButtons = await this.page.locator(this.locators.viewJobsButton.value).all();
            if (viewJobsButtons.length > 0) {
                await viewJobsButtons[0].click();
                await this.waitForPageLoad(this.page);
                await this.page.waitForTimeout(1000);
            }
        }
    }

    async searchForJobs(data) {
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(500);

        console.log('=== Searching for Jobs ===');

        const titleLocators = [
            this.locators.TitleOfJob
        ];

        let titleEntered = false;
        let titleElement = null;

        for (const titleLocator of titleLocators) {
            try {
                if (await this.isElementPresent(this.page, titleLocator)) {
                    console.log(`Found job title search field using: ${titleLocator.name}`);
                    titleElement = await this.waitForElement(this.page, titleLocator);
                    await titleElement.clear();
                    await titleElement.fill(data[2]);
                    console.log(`Successfully entered job title: ${data[2]}`);
                    titleEntered = true;
                    break;
                }
            } catch (e) {
                console.log(`Failed with locator: ${titleLocator.name} - ${e.message}`);
                continue;
            }
        }

        if (!titleEntered) {
            throw new Error('Could not find job title search field with any locator');
        }

        await this.page.waitForTimeout(500);

        // Press Enter to search
        if (titleElement) {
            await titleElement.press('Enter');
            console.log('Pressed ENTER to search for jobs');
        }

        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(2000);
    }

    async DatePosted() {
        await this.page.waitForTimeout(1000);
        await this.clickElement(this.page, this.locators.EasyApplyFilter);
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(1000);
        await this.clickElement(this.page, this.locators.DatePostedButton);
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(1000);
        await this.clickElement(this.page, this.locators.PastWeekButton);
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(500);

        const buttons = await this.page.locator("//button[contains(@class, 'artdeco-button') and contains(@class, 'artdeco-button--primary') and .//span[starts-with(normalize-space(.), 'Show ') and contains(normalize-space(.), 'results')]]").all();
        for (const btn of buttons) {
            const text = await btn.textContent();
            if (text && text.trim().match(/Show \d+ results/)) {
                await btn.click();
                break;
            }
        }

        await this.page.waitForTimeout(1000);
    }

    async applyForJobs(data) {
        let currentPage = 2;
        const maxScrollAttempts = 10;

        while (true) {
            const jobsLocator = this.page.locator(this.locators.listOfJobs.value);
            const jobsCount = await jobsLocator.count();

            if (jobsCount > 0) {
                await this.processJobList(jobsLocator, data);
            } else {
                const jobsFound = await this.scrollForJobs(maxScrollAttempts);
                if (!jobsFound) {
                    if (await this.navigateToNextPage(currentPage)) {
                        currentPage++;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    async processJobList(jobsLocator, data) {
        const jobsCount = await jobsLocator.count();

        for (let i = 0; i < jobsCount; i++) {
            try {
                const job = jobsLocator.nth(i);
                await job.scrollIntoViewIfNeeded();
                await job.click();
                await this.page.waitForTimeout(1000);

                const reachedMaxLimit = await this.page.locator(this.locators.reachedMaxLimit.value).count();
                if (reachedMaxLimit > 0) {
                    console.log('Reached Max Limit so stopped the JOB Application Process');
                    throw new Error('Easy Apply limit reached');
                }

                if (await this.isEasyApplyOrContinuePresent()) {
                    await this.handleEasyApply(data);
                } else {
                    await this.markJobAsApplied(job);
                }
            } catch (error) {
                if (error.message.includes('Easy Apply limit reached')) {
                    throw error;
                }
                console.log(`ElementClickInterceptedException caught, moving to the next job: ${error.message}`);
            }
        }
        await this.page.waitForTimeout(1000);
    }

    async scrollForJobs(maxScrollAttempts) {
        let scrollAttempts = 0;
        let jobsFound = false;
        let pagesFound = false;

        while (!jobsFound && !pagesFound && scrollAttempts < maxScrollAttempts) {
            await this.page.evaluate(() => {
                const element = document.querySelector('.scaffold-layout__list');
                if (element) element.scrollTop += 450;
            });
            await this.waitForPageLoad(this.page);

            jobsFound = (await this.page.locator(this.locators.listOfJobs.value).count()) > 0;
            pagesFound = (await this.page.locator(this.locators.listOfPages.value).count()) > 0;
            scrollAttempts++;
        }

        return jobsFound;
    }

    async navigateToNextPage(currentPage) {
        console.log('Reached maximum scroll attempts, navigating to next page...');
        try {
            const nextPageButton = await this.page.locator(`//ul[@class='artdeco-pagination__pages artdeco-pagination__pages--number']//li//button[@aria-label='Page ${currentPage}']`).first();

            if (await nextPageButton.isVisible()) {
                await nextPageButton.scrollIntoViewIfNeeded();
                await nextPageButton.click();
                await this.page.waitForTimeout(1000);
                return true;
            }
        } catch (error) {
            console.log(`Could not navigate to page ${currentPage}: ${error.message}`);
        }
        return false;
    }

    async isEasyApplyOrContinuePresent() {
        const easyApplyCount = await this.page.locator(this.locators.easyApplyButton.value).count();
        const continueCount = await this.page.locator(this.locators.continueButton.value).count();
        return easyApplyCount > 0 || continueCount > 0;
    }

    async handleEasyApply(data) {
        await this.page.waitForTimeout(1000);
        await this.ClickEasyApplyButtonORContinueButton();
        await this.handleJobApplicationProcess(data);
    }

    async ClickEasyApplyButtonORContinueButton() {
        const continueButtons = await this.page.locator(this.locators.continueButton.value).all();
        if (continueButtons.length > 0) {
            await continueButtons[0].click();
        } else {
            const easyApplyButton = await this.waitForElement(this.page, this.locators.easyApplyButton);
            await easyApplyButton.click();
        }
        await this.page.waitForTimeout(1000);
    }

    async handleJobApplicationProcess(data) {
        let applicationSubmitted = false;
        await this.waitForPageLoad(this.page);

        while (!applicationSubmitted) {
            if (await this.isElementPresent(this.page, this.locators.submitApplicationButton)) {
                applicationSubmitted = await this.clickSubmitApplication();
                if (applicationSubmitted) {
                    console.log('Application submitted');
                    break;
                } else {
                    console.log('Failed to submit application');
                    break;
                }
            }

            if (await this.isElementPresent(this.page, this.locators.continueApplyingButton)) {
                await this.clickElement(this.page, this.locators.continueApplyingButton);
                await this.waitForPageLoad(this.page);
                continue;
            }

            if (await this.nextButton()) {
                await this.waitForPageLoad(this.page);
                await this.handleNextSection(data);
                continue;
            }

            if (await this.isElementPresent(this.page, this.locators.reviewButton)) {
                await this.waitForPageLoad(this.page);
                await this.handleReviewSection(data);
            }

            applicationSubmitted = await this.clickSubmitApplication();
            if (applicationSubmitted) {
                console.log('Application submitted');
            } else {
                console.log('Failed to submit application');
            }
            break;
        }

        await this.waitForPageLoad(this.page);

        if (applicationSubmitted) {
            await this.page.waitForTimeout(2000);

            if (await this.isElementPresent(this.page, this.locators.closeIcon)) {
                await this.clickElement(this.page, this.locators.closeIcon);
                console.log('Clicked Close icon, exiting further actions.');
                return;
            }

            if (await this.isElementPresent(this.page, this.locators.DoneButton)) {
                await this.clickElement(this.page, this.locators.DoneButton);
                console.log('Clicked Done button');
            }
        }
    }

    async nextButton() {
        const nextButtons = await this.page.locator(this.locators.nextButton.value).all();
        if (nextButtons.length > 0) {
            await nextButtons[0].scrollIntoViewIfNeeded();
            await nextButtons[0].click();
            return true;
        }
        return false;
    }

    async handleNextSection(data) {
        const nextButtons = await this.page.locator(this.locators.nextButton.value).all();
        if (nextButtons.length > 0) {
            await this.fillTextQuestions();
            await this.EnterCityName();
            await this.handleRadioButtons();
            await this.handleDropdowns();
            await this.handleCheckboxes();
            await this.JoiningDate();
            await this.textAreaField(data);
        }
    }

    async handleReviewSection(data) {
        const reviewButtons = await this.page.locator(this.locators.reviewButton.value).all();
        if (reviewButtons.length > 0) {
            await this.fillTextQuestions();
            await this.EnterCityName();
            await this.handleDropdowns();
            await this.handleRadioButtons();
            await this.handleCheckboxes();
            await this.JoiningDate();
            await this.textAreaField(data);
            await this.clickElement(this.page, this.locators.reviewButton);
            await this.page.waitForTimeout(1000);
        }
    }

    async fillTextQuestions() {
        const answerFields = await this.page.locator(this.locators.AnswerTextfield.value).all();
        const answerFields2 = await this.page.locator(this.locators.textAreaFiled.value).all();
        const allAnswerFields = [...answerFields, ...answerFields2];

        const questions1 = await this.page.locator(this.locators.Questions1.value).all();
        const questions2 = await this.page.locator(this.locators.Question2.value).all();
        let allQuestions = [...questions1, ...questions2];

        if (allQuestions.length > allAnswerFields.length) {
            allQuestions = allQuestions.slice(0, allAnswerFields.length);
        }

        for (let i = 0; i < allQuestions.length; i++) {
            const questionText = await allQuestions[i].textContent();
            const answer = this.questionAnswerHandler.getAnswer(questionText);
            await allAnswerFields[i].clear();
            await allAnswerFields[i].fill(answer);
        }
    }

    async EnterCityName() {
        const cityNameFields = await this.page.locator(this.locators.cityName.value).all();
        if (cityNameFields.length > 0) {
            for (const field of cityNameFields) {
                await field.clear();
                await field.fill('Bengaluru, Karnataka, India');
                await this.page.waitForTimeout(1000);
                await field.press('Enter');
            }
        }
    }

    async handleRadioButtons() {
        const radioGroups = await this.page.locator("//fieldset[@data-test-form-builder-radio-button-form-component='true']").all();
        console.log(`Total radio button groups found: ${radioGroups.length}`);

        for (let i = 0; i < radioGroups.length; i++) {
            const radioButtons = await radioGroups[i].locator(".//input[@type='radio']").all();
            console.log(`Total radio buttons in group ${i + 1}: ${radioButtons.length}`);

            if (radioButtons.length > 0) {
                const firstRadioButton = radioButtons[0];
                const isSelected = await firstRadioButton.isChecked();

                if (!isSelected) {
                    const firstRadioId = await firstRadioButton.getAttribute('id');
                    const firstLabel = this.page.locator(`label[for="${firstRadioId}"]`);
                    await firstLabel.click();
                    console.log(`Selected first available option in group ${i + 1}.`);
                } else {
                    console.log(`First option in group ${i + 1} is already selected. Skipping.`);
                }
            }

            await this.page.waitForTimeout(1000);
        }
    }

    async handleDropdowns() {
        const dropdowns = await this.page.locator(this.locators.dropdownButtons.value).all();
        if (dropdowns.length > 0) {
            for (const dropdown of dropdowns) {
                await dropdown.scrollIntoViewIfNeeded();
                await dropdown.selectOption({ index: 1 });
                const selectedOption = await dropdown.inputValue();
                console.log(`Selected option: ${selectedOption}`);
            }
        } else {
            console.log('No Dropdowns found');
        }
    }

    async handleCheckboxes() {
        const checkboxes = await this.page.locator(this.locators.checkBox.value).all();

        if (checkboxes.length > 0) {
            for (let i = 0; i < checkboxes.length; i++) {
                try {
                    const checkbox = checkboxes[i];
                    const isSelected = await checkbox.isChecked();

                    if (!isSelected) {
                        const checkboxId = await checkbox.getAttribute('id');
                        const label = this.page.locator(`label[for="${checkboxId}"]`);
                        await label.click();
                    }
                } catch (error) {
                    console.log(`Error handling checkbox ${i}: ${error.message}`);
                }
            }
        }
    }

    async textAreaField(data) {
        try {
            const textAreas = await this.page.locator(this.locators.textAreaFiled.value).all();
            if (textAreas && textAreas.length > 0) {
                for (const textArea of textAreas) {
                    try {
                        await textArea.scrollIntoViewIfNeeded();
                        await textArea.clear();
                        await textArea.fill(data[6]);
                    } catch (error) {
                        console.log(`Error interacting with text area: ${error.message}`);
                    }
                }
            } else {
                console.log('No text area elements found.');
            }
        } catch (error) {
            console.log(`Error handling text area fields: ${error.message}`);
        }
    }

    async JoiningDate() {
        await this.waitForPageLoad(this.page);
        const dateFields = await this.page.locator(this.locators.DateTextField.value).all();
        if (dateFields.length > 0) {
            await dateFields[0].click();
            await this.page.waitForTimeout(2000);
            await this.DynamicDateSelector();
        }
    }

    async DynamicDateSelector() {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 15);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = targetDate.toLocaleDateString('en-US', options);
        const dynamicXPath = `//button[@aria-label='${formattedDate}.']`;
        console.log(`Dynamic XPath: ${dynamicXPath}`);

        try {
            const dateButton = this.page.locator(dynamicXPath);
            await dateButton.scrollIntoViewIfNeeded();
            await dateButton.click();
            console.log(`Selected date: ${formattedDate}`);
        } catch (error) {
            console.log(`Date button not found for: ${formattedDate}`);
        }
    }

    async clickSubmitApplication() {
        let isSubmitted = false;
        await this.JobName();
        const submitButtons = await this.page.locator(this.locators.submitApplicationButton.value).all();
        if (submitButtons.length > 0) {
            await submitButtons[0].scrollIntoViewIfNeeded();
            await submitButtons[0].click();
            isSubmitted = true;
        }
        return isSubmitted;
    }

    async JobName() {
        await this.waitForPageLoad(this.page);
        const jobTitleElement = await this.findElement(this.page, this.locators.JobTitle);
        if (jobTitleElement) {
            const jobTitle = await jobTitleElement.textContent();
            const cleanJobTitle = jobTitle.replace('Apply to ', '');
            this.appliedJobsCount++;
            console.log(`Applied to this Job from LinkedIn: ${cleanJobTitle}`);
            console.log(`Total Jobs Applied on LinkedIn: ${this.appliedJobsCount}`);
        }
    }

    async markJobAsApplied(job) {
        console.log('Easy Apply or Continue button not present on L2 page, marking this job as Applied and skipping.');
        await this.page.goBack();
        await this.page.waitForTimeout(2000);
        await job.evaluate(el => el.textContent = 'Applied');
        await this.page.waitForTimeout(2000);
    }

    async SignedOut() {
        await this.page.context().clearCookies();
        await this.page.goto('https://www.linkedin.com/m/logout/');
        await this.waitForPageLoad(this.page);
        await this.page.reload();
    }
}

module.exports = LinkedinPage;
