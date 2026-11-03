import LocatorsDetails from '../utils/LocatorsDetails';

/**
 * Naukri Page Locators
 * Centralized repository of all Naukri.com element locators
 * Updated for current Naukri UI (2026)
 */
export class NaukriLocators {
    // ==================== LOGIN LOCATORS ====================
    readonly EmailID = new LocatorsDetails(
        'xpath',
        "//input[contains(@placeholder, 'Email ID') or contains(@placeholder, 'Username')]",
        'Email ID Input'
    );

    readonly Password = new LocatorsDetails(
        'xpath',
        "//input[@type='password' or contains(@placeholder, 'Password') or contains(@placeholder, 'password')]",
        'Password Input'
    );

    readonly LoginButton = new LocatorsDetails(
        'xpath',
        "//button[@type='submit' and text()='Login']",
        'Login Button'
    );

    // ==================== PROFILE UPDATE LOCATORS ====================
    readonly EditIcon = new LocatorsDetails(
        'xpath',
        "//em[@class='icon edit']",
        'Edit Icon'
    );

    readonly SaveButton = new LocatorsDetails(
        'xpath',
        "//button[contains(@class,'updateProfile')]",
        'Save Button'
    );

    // ==================== NAVIGATION LOCATORS ====================
    readonly JobButton = new LocatorsDetails(
        'xpath',
        "//a[text()='Jobs']",
        'Job Button'
    );

    readonly SearchIcon1 = new LocatorsDetails(
        'xpath',
        "//span[@class='nI-gNb-sb__placeholder']",
        'Search Icon 1'
    );

    readonly SearchIcon2 = new LocatorsDetails(
        'xpath',
        "//button[text()='Search']",
        'Search Icon 2'
    );

    // ==================== SEARCH FILTER LOCATORS ====================
    readonly Designation = new LocatorsDetails(
        'xpath',
        "//input[@placeholder='Enter keyword / designation / companies']",
        'Designation Input'
    );

    readonly Location = new LocatorsDetails(
        'xpath',
        "//input[@placeholder='Enter location']",
        'Location Input'
    );

    readonly ExperienceButton = new LocatorsDetails(
        'xpath',
        "//div[@class='dropdownMainContainer']//span[text()='Experience']",
        'Experience Button'
    );

    // ==================== JOB LIST LOCATORS ====================
    readonly listOfJobs = new LocatorsDetails(
        'xpath',
        "//div[@class='cust-job-tuple layout-wrapper lay-2 sjw__tuple ']",
        'List of Jobs'
    );

    readonly listOfJobsFromSearch = new LocatorsDetails(
        'xpath',
        "//article[@class='jobTuple bgWhite br4 mb-8']",
        'List of Jobs From Search'
    );

    readonly ApplyButton = new LocatorsDetails(
        'xpath',
        "//button[text()='Apply']",
        'Apply Button'
    );

    readonly ApplyCompanySite = new LocatorsDetails(
        'xpath',
        "//button[text()='Apply on company site']",
        'Apply on Company Site Button'
    );

    readonly JobTitle = new LocatorsDetails(
        'xpath',
        "//h1[@class='jd-header-title']",
        'Job Title'
    );

    // ==================== PAGINATION LOCATORS ====================
    readonly pageNum = new LocatorsDetails(
        'xpath',
        "//div[@class='styles_pagination__oZVUR']//a",
        'Page Numbers'
    );

    // ==================== CHATBOT LOCATORS ====================
    readonly chatBotPage = new LocatorsDetails(
        'xpath',
        "//div[@class='chatBot chatBot-panel']",
        'Chatbot Page'
    );

    readonly chatBotQuestion = new LocatorsDetails(
        'xpath',
        "//p[@class='msg-text']",
        'Chatbot Question'
    );

    readonly answerTextFiled = new LocatorsDetails(
        'xpath',
        "//input[@type='text' and @class='inputBox']",
        'Answer Text Field'
    );

    readonly RadioButtons = new LocatorsDetails(
        'xpath',
        "//input[@type='radio']",
        'Radio Buttons'
    );

    readonly checkbox = new LocatorsDetails(
        'xpath',
        "//input[@type='checkbox']",
        'Checkbox'
    );

    readonly yesButton = new LocatorsDetails(
        'xpath',
        "//button[text()='Yes']",
        'Yes Button'
    );

    readonly SearchFiled = new LocatorsDetails(
        'xpath',
        "//input[@type='search']",
        'Search Field'
    );

    readonly suggestionList = new LocatorsDetails(
        'xpath',
        "//li[@class='suggestion']",
        'Suggestion List'
    );

    readonly saveButtonContainer = new LocatorsDetails(
        'xpath',
        "//div[@class='questionWrap']",
        'Save Button Container'
    );

    readonly skipThisQues = new LocatorsDetails(
        'xpath',
        "//a[text()='Skip this question']",
        'Skip This Question'
    );

    readonly DOBfield = new LocatorsDetails(
        'xpath',
        "//input[@type='tel']",
        'DOB Field'
    );

    // ==================== LIMIT REACHED LOCATOR ====================
    readonly ReachedMaxLimit = new LocatorsDetails(
        'xpath',
        "//span[text()='You have reached the maximum application']",
        'Reached Max Limit'
    );
}

export default NaukriLocators;
