const GenericMethods = require('../utils/GenericMethods');
const NaukriLocators = require('../locators/NaukriLocators');
const QuestionAnswerHandler = require('../utils/QuestionAnswerHandler');
const DataConfig = require('../utils/DataConfig');

class NaukriPage extends GenericMethods {
    constructor(page) {
        super();
        this.page = page;
        this.locators = new NaukriLocators();
        const datasetName = DataConfig.getInstance().getDatasetName();
        if (datasetName) {
            this.questionAnswerHandler = new QuestionAnswerHandler(datasetName);
        }
        this.appliedJobsCount = 0;
    }

    async NaukriLogin(data) {
        await this.waitForPageLoad(this.page);
        await this.sendKeysToElement(this.page, this.locators.EmailID, data[0]);
        await this.sendKeysToElement(this.page, this.locators.Password, data[1]);
        await this.clickElement(this.page, this.locators.LoginButton);
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(3000);
    }

    async NaukriUpdate() {
        await this.waitForPageLoad(this.page);
        await this.page.goto('https://www.naukri.com/mnjuser/profile');
        await this.page.reload();
        await this.page.waitForTimeout(2000);

        let isChatbotActive = await this.isElementPresent(this.page, this.locators.chatBotPage);

        while (isChatbotActive) {
            await this.waitForPageLoad(this.page);

            if (await this.isElementPresent(this.page, this.locators.chatBotPage)) {
                try {
                    const closeIcon = this.page.locator("//div[@class='crossIcon chatBot chatBot-ic-cross']");
                    const count = await closeIcon.count();

                    if (count > 0) {
                        await closeIcon.first().click();
                        await this.page.waitForTimeout(2000);

                        if (!(await this.isElementPresent(this.page, this.locators.chatBotPage))) {
                            isChatbotActive = false;
                            console.log('Chatbot closed successfully');
                        }
                    }
                } catch (error) {
                    console.log(`Could not close chatbot: ${error.message}`);
                    isChatbotActive = false;
                }
            } else {
                isChatbotActive = false;
            }
        }

        await this.page.waitForTimeout(1000);
        await this.waitForPageLoad(this.page);
        await this.clickElement(this.page, this.locators.EditIcon);
        await this.page.waitForTimeout(3000);
        await this.clickElement(this.page, this.locators.SaveButton);
    }

    async JobApplyFrom_Recommended() {
        await this.waitForPageLoad(this.page);
        await this.clickElement(this.page, this.locators.JobButton);
        await this.waitForPageLoad(this.page);
        await this.JobsApply();
    }

    async JobApplyFromSearch(data) {
        await this.waitForPageLoad(this.page);
        await this.scrollToTop(this.page);
        await this.page.waitForTimeout(2000);
        await this.handlePromoPopup();
        await this.clickElement(this.page, this.locators.SearchIcon1);
        await this.waitForPageLoad(this.page);
        await this.sendKeysToElement(this.page, this.locators.Designation, data[3]);
        await this.clickElement(this.page, this.locators.ExperienceButton);

        const experience = data[5].replace(/"/g, '');
        const xpath = `//span[.='${experience} years']`;
        const experienceElement = this.page.locator(xpath);
        await experienceElement.click();

        await this.sendKeysToElement(this.page, this.locators.Location, data[4]);
        await this.clickElement(this.page, this.locators.SearchIcon2);
        await this.waitForPageLoad(this.page);
        await this.page.waitForTimeout(2000);
        await this.JobsApply();
    }

    async JobsApply() {
        await this.applyJobsOnCurrentPage();

        while (true) {
            const pageNumbers = await this.page.locator(this.locators.pageNum.value).all();
            let nextPageFound = false;

            for (let i = 0; i < pageNumbers.length; i++) {
                await this.page.waitForTimeout(2000);
                const currentPageNumbers = await this.page.locator(this.locators.pageNum.value).all();
                const classAttr = await currentPageNumbers[i].getAttribute('class');

                if (classAttr && classAttr.includes('styles_selected__')) {
                    if (i + 1 < currentPageNumbers.length) {
                        await currentPageNumbers[i + 1].click();
                        await this.page.waitForTimeout(2000);
                        nextPageFound = true;
                        await this.applyJobsOnCurrentPage();
                        break;
                    }
                }
            }

            if (!nextPageFound) {
                console.log('No more pages to navigate.');
                break;
            }
        }
    }

    async applyJobsOnCurrentPage() {
        await this.page.waitForTimeout(2000);
        let jobList = [];

        if (await this.isElementPresent(this.page, this.locators.listOfJobs)) {
            const jobs = await this.page.locator(this.locators.listOfJobs.value).all();
            jobList.push(...jobs);
        }

        if (await this.isElementPresent(this.page, this.locators.listOfJobsFromSearch)) {
            const jobs = await this.page.locator(this.locators.listOfJobsFromSearch.value).all();
            jobList.push(...jobs);
        }

        const originalPage = this.page;
        const context = this.page.context();

        for (const job of jobList) {
            await job.click();
            await this.page.waitForTimeout(3000);

            const pages = context.pages();
            let newPage = null;

            for (const page of pages) {
                if (page !== originalPage) {
                    newPage = page;
                    break;
                }
            }

            if (newPage) {
                const applyButtons = await newPage.locator(this.locators.ApplyButton.value).all();

                if (applyButtons.length > 0) {
                    await this.JobName(newPage);
                    await applyButtons[0].click();
                    await this.waitForPageLoad(newPage);
                    await this.page.waitForTimeout(1000);

                    const maxLimitElements = await newPage.locator(this.locators.ReachedMaxLimit.value).all();
                    if (maxLimitElements.length > 0) {
                        console.log('Reached Max Limit exciting the Job Application Process');
                        await context.close();
                        return;
                    }

                    await this.page.waitForTimeout(2000);
                    await this.handleChatbot(newPage);

                    if (pages.includes(newPage)) {
                        console.log('Closing the chatbot window.');
                        await newPage.close();
                    }
                } else {
                    const companySiteButtons = await newPage.locator(this.locators.ApplyCompanySite.value).all();
                    if (companySiteButtons.length > 0) {
                        console.log('Closing the company site window.');
                        await newPage.close();
                    } else {
                        console.log('Closing the window as no relevant buttons were found.');
                        await newPage.close();
                    }
                }
            } else {
                console.log('No new window found.');
            }
        }
    }

    async handleChatbot(page) {
        await this.waitForPageLoad(page);

        if (!(await this.isElementPresent(page, this.locators.chatBotPage))) {
            console.log('Chatbot is not present');
            return;
        }

        let isChatbotActive = true;

        while (isChatbotActive) {
            await this.waitForPageLoad(page);

            const skipButtonClicked = await this.handleSkipQuestion(page);
            const answerProvided = await this.handleAnswers(page);

            await this.handleSaveButton(page, skipButtonClicked, answerProvided);

            await this.page.waitForTimeout(2000);
            isChatbotActive = await this.isElementPresent(page, this.locators.chatBotPage);

            if (isChatbotActive) {
                console.log('Chatbot is still active, processing next question.');
            }
        }

        console.log('Chatbot handling completed');
    }

    async handleSkipQuestion(page) {
        if (await this.isElementPresent(page, this.locators.skipThisQues)) {
            await this.clickElement(page, this.locators.skipThisQues);
            await this.page.waitForTimeout(2000);
            return true;
        }
        return false;
    }

    async handleAnswers(page) {
        const dobFields = await page.locator(this.locators.DOBfield.value).all();
        if (dobFields.length > 0) {
            await this.handleDOB(page);
            return true;
        }

        if (await this.handleTextFieldAnswer(page)) {
            return true;
        }

        if (await this.handleRadioButtons(page)) {
            return true;
        }

        if (await this.handleCheckboxes(page)) {
            return true;
        }

        if (await this.handleYesButton(page)) {
            return true;
        }

        if (await this.handleSearchField(page)) {
            return true;
        }

        return false;
    }

    async handleDOB(page) {
        await this.waitForPageLoad(page);
        await this.page.waitForTimeout(1000);

        const dobFields = await page.locator(this.locators.DOBfield.value).all();

        if (dobFields.length === 0) {
            console.log('No DOB fields found on the page.');
            return;
        }

        const questionElements = await page.locator(this.locators.chatBotQuestion.value).all();
        const questionElement = questionElements[questionElements.length - 1];
        const questionText = await questionElement.textContent();
        const dateValue = this.questionAnswerHandler.getAnswer(questionText);

        await this.page.waitForTimeout(1000);

        if (dateValue && dateValue.trim() !== '') {
            const dateParts = dateValue.split('/');
            console.log(`DOB is ${dateParts.join('/')}`);

            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];

            for (const dobField of dobFields) {
                const placeholder = await dobField.getAttribute('placeholder');
                const ariaLabel = await dobField.getAttribute('aria-label');
                const fieldType = placeholder || ariaLabel || '';

                let answer = '';

                if (fieldType.includes('Day') || fieldType.toUpperCase() === 'DD') {
                    answer = day;
                } else if (fieldType.includes('Month') || fieldType.toUpperCase() === 'MM') {
                    answer = month;
                } else if (fieldType.includes('Year') || fieldType.toUpperCase() === 'YYYY') {
                    answer = year;
                }

                if (answer !== '') {
                    await dobField.fill(answer);
                } else {
                    console.log(`Unrecognized DOB field type, using generic input: ${fieldType}`);
                    await dobField.fill('01');
                }
            }
        } else {
            console.log(`No valid date found for the question: ${questionText}`);
        }
    }

    async handleTextFieldAnswer(page) {
        await this.waitForPageLoad(page);
        await this.page.waitForTimeout(1000);

        if (await this.isElementPresent(page, this.locators.answerTextFiled)) {
            const answerInput = await page.locator(this.locators.answerTextFiled.value).first();

            if (await answerInput.isVisible() && await answerInput.isEnabled()) {
                await this.page.waitForTimeout(1000);
                const questionElements = await page.locator(this.locators.chatBotQuestion.value).all();
                const latestQuestionElement = questionElements[questionElements.length - 1];
                const latestQuestionText = await latestQuestionElement.textContent();
                const answers = this.questionAnswerHandler.getAnswer(latestQuestionText);
                await answerInput.fill(answers);
                await this.page.waitForTimeout(2000);
                return true;
            }
        }
        return false;
    }

    async handleRadioButtons(page) {
        await this.waitForPageLoad(page);
        await this.page.waitForTimeout(1000);

        const radioButtons = await page.locator(this.locators.RadioButtons.value).all();

        if (radioButtons.length > 0) {
            const firstRadioButton = radioButtons[0];

            try {
                if (await firstRadioButton.isVisible() && await firstRadioButton.isEnabled()) {
                    await firstRadioButton.click();
                } else {
                    await firstRadioButton.evaluate(el => el.click());
                }
                await this.page.waitForTimeout(2000);
                return true;
            } catch (error) {
                console.log(`Error clicking radio button: ${error.message}`);
            }
        }
        return false;
    }

    async handleCheckboxes(page) {
        await this.waitForPageLoad(page);
        const checkboxes = await page.locator(this.locators.checkbox.value).all();

        for (const checkbox of checkboxes) {
            if (await checkbox.isVisible() && await checkbox.isEnabled()) {
                const isSelected = await checkbox.isChecked();

                if (!isSelected) {
                    await checkbox.click();
                    await this.page.waitForTimeout(1000);
                } else {
                    console.log('Checkbox already selected.');
                }
                return true;
            }
        }
        return false;
    }

    async handleYesButton(page) {
        await this.waitForPageLoad(page);
        const yesButtons = await page.locator(this.locators.yesButton.value).all();

        if (yesButtons.length > 0) {
            await yesButtons[0].click();
            return true;
        }
        return false;
    }

    async handleSearchField(page) {
        await this.waitForPageLoad(page);
        const searchFields = await page.locator(this.locators.SearchFiled.value).all();

        if (searchFields.length > 0) {
            const questionElements = await page.locator(this.locators.chatBotQuestion.value).all();
            const latestQuestionElement = questionElements[questionElements.length - 1];
            const latestQuestionText = await latestQuestionElement.textContent();
            const answers = this.questionAnswerHandler.getAnswer(latestQuestionText);
            await searchFields[0].fill(answers);
            await this.page.waitForTimeout(2000);
            await this.clickElement(page, this.locators.suggestionList);
            return true;
        }
        return false;
    }

    async handleSaveButton(page, skipButtonClicked, answerProvided) {
        await this.waitForPageLoad(page);

        if (answerProvided && !skipButtonClicked) {
            const containers = await page.locator(this.locators.saveButtonContainer.value).all();

            if (containers.length > 0) {
                const saveButtonContainer = containers[0];
                const saveButtons = await saveButtonContainer.locator('.sendMsg').all();

                if (saveButtons.length > 0) {
                    const saveButton = saveButtons[0];

                    if (await saveButton.isEnabled()) {
                        await saveButton.click();
                        await this.waitForPageLoad(page);
                        console.log('Save button clicked successfully.');
                    } else {
                        console.log('Save button is present but not enabled.');
                    }
                } else {
                    console.log('Save button not found inside container.');
                }
            } else {
                console.log('Save button container not found.');
            }
        } else {
            if (skipButtonClicked) {
                console.log('Skip button was clicked, not processing save button.');
            } else {
                console.log('Answer not provided, skipping save button.');
            }
        }
    }

    async handlePromoPopup() {
        try {
            await this.page.waitForTimeout(2000);

            const popupOverlay = await this.page.locator("//div[@class='ltLayer open']").all();

            if (popupOverlay.length > 0) {
                console.log('Promotional popup detected, attempting to close...');

                const closeButtonXpaths = [
                    "//button[@class='layer_cross_icon icon icon-cross']",
                    "//button[contains(@class, 'layer_cross_icon')]",
                    "//*[@class='icon-cross']",
                    "//button[contains(@class, 'cross')]",
                    "//*[contains(@class, 'close') or contains(@class, 'cross')]"
                ];

                let closed = false;

                for (const xpath of closeButtonXpaths) {
                    try {
                        const closeButtons = await this.page.locator(xpath).all();

                        if (closeButtons.length > 0) {
                            const closeButton = closeButtons[0];

                            try {
                                await closeButton.click({ timeout: 3000 });
                                closed = true;
                                console.log(`Popup closed with xpath: ${xpath}`);
                                await this.page.waitForTimeout(1000);
                                break;
                            } catch (e) {
                                await closeButton.evaluate(el => el.click());
                                closed = true;
                                console.log(`Popup closed with JavaScript using xpath: ${xpath}`);
                                await this.page.waitForTimeout(1000);
                                break;
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                }

                if (!closed) {
                    console.log('Close button not found, removing overlay with JavaScript...');
                    await this.page.evaluate(() => {
                        const overlay = document.querySelector('.ltLayer.open');
                        if (overlay) overlay.remove();
                        const popup = document.querySelector('[class*="layer"]');
                        if (popup) popup.remove();
                    });
                    await this.page.waitForTimeout(1000);
                    console.log('Overlay removed with JavaScript.');
                }

                const popupOverlayAfter = await this.page.locator("//div[@class='ltLayer open']").all();
                if (popupOverlayAfter.length === 0) {
                    console.log('Promotional popup closed successfully.');
                } else {
                    console.log('Warning: Popup may still be present.');
                }
            } else {
                console.log('No promotional popup found, proceeding normally.');
            }
        } catch (error) {
            console.log(`Error handling promotional popup: ${error.message}`);
        }
    }

    async JobName(page) {
        await this.waitForPageLoad(page);
        const jobTitleElement = await page.locator(this.locators.JobTitle.value).first();
        const jobTitle = await jobTitleElement.textContent();
        const cleanJobTitle = jobTitle.replace('Apply to ', '');
        this.appliedJobsCount++;
        console.log(`Applied to Job from Naukri: ${cleanJobTitle}`);
        console.log(`Total Jobs Applied on Naukri: ${this.appliedJobsCount}`);
    }
}

module.exports = NaukriPage;
