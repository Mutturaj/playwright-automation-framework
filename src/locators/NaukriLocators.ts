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
        "//input[@id='usernameField']",
        'Enter Email'
    );

    readonly Password = new LocatorsDetails(
        'xpath',
        "//input[@id='passwordField']",
        'Password'
    );

    readonly LoginButton = new LocatorsDetails(
        'xpath',
        "//button[.='Login']",
        'Login Button'
    );

    // ==================== PROFILE UPDATE LOCATORS ====================
    readonly ViewProfile = new LocatorsDetails(
        'xpath',
        "//a[text()='View']",
        'View Profile button'
    );

    readonly EditIcon = new LocatorsDetails(
        'xpath',
        "//span[text()='Resume headline']/following-sibling::span[@class='edit icon' and .='editOneTheme']",
        'Edit Icon'
    );

    readonly SaveButton = new LocatorsDetails(
        'xpath',
        "//button[.='Save']",
        'Save button'
    );

    readonly SuccessMessage = new LocatorsDetails(
        'xpath',
        "//p[.='Success']",
        'Success Message'
    );

    // ==================== NAVIGATION LOCATORS ====================
    readonly JobButton = new LocatorsDetails(
        'xpath',
        "//div[.='Jobs']",
        'Job Button'
    );

    readonly SearchIcon1 = new LocatorsDetails(
        'xpath',
        "//button[@aria-label='Search jobs here']",
        'Search Icon'
    );

    readonly SearchIcon2 = new LocatorsDetails(
        'xpath',
        "//span[.='Search']",
        'Search Icon'
    );

    // ==================== SEARCH FILTER LOCATORS ====================
    readonly Designation = new LocatorsDetails(
        'xpath',
        "//input[@placeholder=\"Enter keyword / designation / companies\"]",
        'Job Search'
    );

    readonly Location = new LocatorsDetails(
        'xpath',
        "//input[@placeholder=\"Enter location\"]",
        'Location Text Filed'
    );

    readonly ExperienceButton = new LocatorsDetails(
        'xpath',
        "//input[@id='experienceDD']",
        'Experience '
    );

    // ==================== JOB LIST LOCATORS ====================
    readonly listOfJobs = new LocatorsDetails(
        'xpath',
        "//span[@class='ellipsis dspIB valignM    ' and contains(text(),'Yrs')]",
        'List of Jobs'
    );

    readonly listOfJobsFromSearch = new LocatorsDetails(
        'xpath',
        "//span[@class='ni-job-tuple-icon ni-job-tuple-icon-srp-experience exp']//span",
        'Job List from Search'
    );

    readonly ApplyButton = new LocatorsDetails(
        'xpath',
        "//div[@class='styles_jhc__apply-button-container__5Bqnb']/button[.='Apply']",
        'Apply Button'
    );

    readonly ApplyCompanySite = new LocatorsDetails(
        'xpath',
        "//div[@class='styles_jhc__apply-button-container__5Bqnb']/button[.='Apply on company site']",
        'Apply On Company Site Button'
    );

    readonly JobTitle = new LocatorsDetails(
        'xpath',
        "//h1[@class=\"styles_jd-header-title__rZwM1\"]",
        'Job Name'
    );

    // ==================== PAGINATION LOCATORS ====================
    readonly pageNum = new LocatorsDetails(
        'xpath',
        "//div[@class='styles_pages__v1rAK']/a",
        'Page nums'
    );

    // ==================== CHATBOT LOCATORS ====================
    readonly closeIcon = new LocatorsDetails(
        'xpath',
        "//div[@class='crossIcon chatBot chatBot-ic-cross']",
        'Cross Icon'
    );

    readonly premiumCloseIcon = new LocatorsDetails(
        'xpath',
        "//div[contains(@class,'profileUpdatedProLayer')]//div[@class='crossLayer']",
        'Close Icon on Premium-popup'
    );

    readonly chatBotPage = new LocatorsDetails(
        'xpath',
        "//div[@class='chatbot_Drawer chatbot_right']",
        'Chat bot page'
    );

    readonly chatBotQuestion = new LocatorsDetails(
        'xpath',
        "//div[@class='botMsg msg ']//span",
        'Chat Bot Question'
    );

    readonly answerTextFiled = new LocatorsDetails(
        'xpath',
        "//div[@class='textArea' and @data-placeholder='Type message here...']",
        'Input text filed'
    );

    readonly RadioButtons = new LocatorsDetails(
        'xpath',
        "//div[@class='ssrc__radio-btn-container']/label",
        'Radio buttons'
    );

    readonly checkbox = new LocatorsDetails(
        'xpath',
        "//div[@class='multicheckboxes-container']//label[1]",
        'Check box'
    );

    readonly yesButton = new LocatorsDetails(
        'xpath',
        "//div[@class='chatbot_Chip chipInRow chipItem']//span[text()='Yes']",
        'Yes button'
    );

    readonly SearchFiled = new LocatorsDetails(
        'xpath',
        "//div[@class='ssc__input-container']/input",
        'Search Textfield'
    );

    readonly suggestionList = new LocatorsDetails(
        'xpath',
        "//div[@id='ssc__option_0']//div[@class='ssc__heading']",
        'Suggestion list'
    );

    readonly saveButtonContainer = new LocatorsDetails(
        'xpath',
        "//div[starts-with(@id, 'sendMsg__') and contains(@class, 'send') and not(contains(@class, 'disabled'))]",
        'Save Button'
    );

    readonly skipThisQues = new LocatorsDetails(
        'xpath',
        "//span[text()='Skip this question']",
        'Skip this button'
    );

    readonly DOBfield = new LocatorsDetails(
        'xpath',
        "//div[@class='dob__input-container']//input[contains(@id, 'dobInput')]",
        'DOB Filed'
    );

    // ==================== LIMIT REACHED LOCATOR ====================
    readonly ReachedMaxLimit = new LocatorsDetails(
        'xpath',
        "//span[.='There was an error while processing your request, please try again later']",
        'Reached Max Limit'
    );
}

export default NaukriLocators;
