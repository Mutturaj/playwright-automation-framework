import LocatorsDetails from '../utils/LocatorsDetails';

/**
 * LinkedIn Page Locators
 * Centralized repository of all LinkedIn element locators
 */
export class LinkedinLocators {
    // ==================== LOGIN LOCATORS ====================
    readonly EmailID = new LocatorsDetails(
        'xpath',
        "//input[@type='email' and @autocomplete='username webauthn']",
        'EmailID Input'
    );

    readonly Password = new LocatorsDetails(
        'xpath',
        "(//button[@aria-label='Show password']/ancestor::div[2]//input[@type='password'])[2]",
        'Password Input'
    );

    readonly SignInButton = new LocatorsDetails(
        'xpath',
        "(//button[.//span[normalize-space()='Sign in']])[2]",
        'Sign in Button'
    );

    readonly LoginWithEmail = new LocatorsDetails(
        'xpath',
        "//a[@class=\"sign-in-form__sign-in-cta my-2 py-1 btn-md btn-secondary block min-h-[40px] babybear:w-full\"]",
        'Login with Email button'
    );

    readonly AgreeAndReJoinButton = new LocatorsDetails(
        'xpath',
        "//button[@value='Agree & Join']",
        'Agree and Re-Join Button'
    );

    // ==================== NAVIGATION LOCATORS ====================
    readonly JobIcon = new LocatorsDetails(
        'xpath',
        "//li-icon[@type='job']",
        'Job Icon'
    );

    readonly NotificationIcon = new LocatorsDetails(
        'xpath',
        "//a[contains(@href, '/notifications/')]//li-icon[@type='bell-fill']",
        'Notification Icon'
    );

    readonly viewJobsButton = new LocatorsDetails(
        'xpath',
        "//span[@class='artdeco-button__text']//span[1]",
        'View Jobs Button'
    );

    readonly ShowAllButton = new LocatorsDetails(
        'xpath',
        "//div[@class='discovery-templates-vertical-list__footer']/a[@href='https://www.linkedin.com/jobs/collections/recommended?discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII']",
        'Show All Button'
    );

    // ==================== SEARCH LOCATORS ====================
    readonly SearchIcon = new LocatorsDetails(
        'xpath',
        "//*[name()='svg' and @class='jobs-search-box__search-icon--custom']",
        'Search Icon'
    );

    readonly TitleOfJob = new LocatorsDetails(
        'xpath',
        "//input[@data-testid=\"typeahead-input\"]",
        'Job search icon'
    );

    readonly LocationOfJob = new LocatorsDetails(
        'xpath',
        "//input[@aria-label=\"City, state, or zip code\" and contains(@id, 'jobs-search-box-location-id-')]",
        'Location of the Job'
    );

    readonly SearchBox = new LocatorsDetails(
        'xpath',
        "//button[text()='Search']",
        'Search Box'
    );

    // ==================== FILTER LOCATORS ====================
    readonly EasyApplyFilter = new LocatorsDetails(
        'xpath',
        "//button[@aria-label='Easy Apply filter.']",
        'Easy Apply Filter'
    );

    readonly DatePostedButton = new LocatorsDetails(
        'xpath',
        "//button[text()='Date posted']",
        'Date Posted button'
    );

    readonly PastWeekButton = new LocatorsDetails(
        'xpath',
        "//span[text()='Past week']",
        'Past Week'
    );

    readonly AllFiltersButton = new LocatorsDetails(
        'xpath',
        "//button[text()='All filters']",
        'All filters Button'
    );

    readonly JobTitleFilter = new LocatorsDetails(
        'xpath',
        "//h3[text()='Title']",
        'Job Title Filter'
    );

    readonly JobTitleCheckbox = new LocatorsDetails(
        'xpath',
        "//h3[text()='Title']/ancestor::fieldset//input[@name='title-filter-value']",
        'Jobs Title Check Boxes'
    );

    readonly ShowAllResults = new LocatorsDetails(
        'xpath',
        "//button[@data-test-reusables-filters-modal-show-results-button='true']",
        'Show All results Button'
    );

    // ==================== JOB LIST LOCATORS ====================
    readonly listOfJobs = new LocatorsDetails(
        'xpath',
        "//span[normalize-space()='Easy Apply']/ancestor::li[1]",
        'List of Jobs'
    );

    readonly listOfJobsFrame = new LocatorsDetails(
        'cssSelector',
        '.scaffold-layout__list .jobs-search-results-list',
        'List of Jobs Frame'
    );

    readonly listOfPages = new LocatorsDetails(
        'xpath',
        "//ul[@class='artdeco-pagination__pages artdeco-pagination__pages--number']//li//button[contains(@aria-label, 'Page')]",
        'List of Pages'
    );

    readonly dot = new LocatorsDetails(
        'xpath',
        "//ul[@class='artdeco-pagination__pages artdeco-pagination__pages--number']//li//button[contains(@aria-label, 'Page')]",
        'Dots in the list of the pages'
    );

    readonly nextPage1 = new LocatorsDetails(
        'xpath',
        "//button[@aria-label='View next page']",
        'Next Button'
    );

    readonly AppliedText = new LocatorsDetails(
        'xpath',
        "//li[contains(@class, 'job-card-container__footer-item') and contains(@class, 'job-card-container__footer-job-state') and contains(., 'Applied')]",
        'Applied Text'
    );

    // ==================== APPLICATION BUTTON LOCATORS ====================
    readonly easyApplyButton = new LocatorsDetails(
        'xpath',
        "//button[contains(normalize-space(@class), 'jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view')]//span[text()='Easy Apply']",
        'Easy Apply button'
    );

    readonly continueButton = new LocatorsDetails(
        'xpath',
        "//div[@class='display-flex']//button//span[text()='Continue']",
        'Continue button'
    );

    readonly continueApplyingButton = new LocatorsDetails(
        'xpath',
        "//span[@class='artdeco-button__text' and text()='Continue applying']",
        'Continue applying button'
    );

    readonly nextButton = new LocatorsDetails(
        'xpath',
        "//button[@aria-label='Continue to next step']//span[text()='Next']",
        'Next button'
    );

    readonly reviewButton = new LocatorsDetails(
        'xpath',
        "//span[text()='Review']",
        'Review Button'
    );

    readonly submitApplicationButton = new LocatorsDetails(
        'xpath',
        "//span[text()='Submit application']",
        'Submit Application button'
    );

    readonly DoneButton = new LocatorsDetails(
        'xpath',
        "//span[text()='Done']",
        'Done button'
    );

    readonly closeIcon = new LocatorsDetails(
        'xpath',
        "//div[@aria-labelledby=\"post-apply-modal\"]//*[name()='svg'and @data-test-icon=\"close-medium\"]",
        'Close Icon'
    );

    readonly discard = new LocatorsDetails(
        'xpath',
        "//button[@data-control-name='discard_application_confirm_btn']//span[text()='Discard']",
        'Discard Button'
    );

    // ==================== FORM ELEMENT LOCATORS ====================
    readonly AnswerTextfield = new LocatorsDetails(
        'xpath',
        "//div[@class='artdeco-text-input--container ember-view']//input[@type='text']",
        'List of answers Textfield'
    );

    readonly textAreaFiled = new LocatorsDetails(
        'xpath',
        "//textarea[contains(@class, 'artdeco-text-input__textarea') and @required]",
        'Text Area Filed'
    );

    readonly Questions1 = new LocatorsDetails(
        'xpath',
        "//div[@class='artdeco-text-input--container ember-view']//label[@class='artdeco-text-input--label']",
        'All Questions'
    );

    readonly Question2 = new LocatorsDetails(
        'xpath',
        "//span[@class='jobs-easy-apply-form-section__group-title t-14']",
        'All Questions'
    );

    readonly Question3 = new LocatorsDetails(
        'xpath',
        "//label[contains(@class, 'fb-dash-form-element__label')]//span[contains(., 'Location (city)')][1]",
        'Email or Location text'
    );

    readonly cityName = new LocatorsDetails(
        'xpath',
        "//input[contains(@id, 'location-GEO-LOCATION') or contains(@id, 'city-HOME-CITY')]",
        'Enter City Name'
    );

    readonly DateTextField = new LocatorsDetails(
        'xpath',
        "//input[@placeholder='mm/dd/yyyy']",
        'Date Text field'
    );

    // ==================== RADIO, CHECKBOX, DROPDOWN LOCATORS ====================
    readonly radioButtons = new LocatorsDetails(
        'xpath',
        ".//input[@type='radio' and @value='Yes']",
        'Radio button'
    );

    readonly radioButtons1 = new LocatorsDetails(
        'xpath',
        "//div[@class='fb-text-selectable__option display-flex']//input[@type='radio']",
        'List of Radio buttons'
    );

    readonly radioButtons2 = new LocatorsDetails(
        'xpath',
        "//div[@class='fb-text-selectable__option display-flex']//input[@type='radio']",
        'Radio buttons'
    );

    readonly radioGroups = new LocatorsDetails(
        'xpath',
        "//fieldset[@data-test-form-builder-radio-button-form-component='true']",
        'Radio Groups'
    );

    readonly checkBox = new LocatorsDetails(
        'xpath',
        "//input[@type='checkbox' and contains(@class, 'fb-form-element__checkbox')]",
        'List of Checkbox'
    );

    readonly dropdownButtons = new LocatorsDetails(
        'xpath',
        "//span[@class='visually-hidden']//following::select",
        'List of DropDowns'
    );

    // ==================== JOB INFO LOCATORS ====================
    readonly JobTitle = new LocatorsDetails(
        'xpath',
        "//h2[@id='jobs-apply-header']",
        'Job Name'
    );

    readonly reachedMaxLimit = new LocatorsDetails(
        'xpath',
        "//span[text()='You've reached the Easy Apply application limit for today. Save this job and come back tomorrow to continue applying.']",
        'Reached Max limit'
    );

    // ==================== PROFILE LOCATORS ====================
    readonly profileIcon = new LocatorsDetails(
        'xpath',
        "//span[@class='t-12 global-nav__primary-link-text' and text()='Me']",
        'Profile Icon'
    );
}

export default LinkedinLocators;
