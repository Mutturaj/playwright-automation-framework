const LocatorsDetails = require('../utils/LocatorsDetails');

class LinkedinLocators {
    constructor() {
        // Login locators
        this.EmailID = new LocatorsDetails('xpath', "//input[@name='session_key']", 'EmailID Input');
       
        this.Password = new LocatorsDetails('xpath', "//input[@name='session_password']", 'Password Input');
       
        this.SignInButton = new LocatorsDetails('xpath', "//button[@type='submit']", 'Sign in Button');
        
        // Navigation locators
        this.JobIcon = new LocatorsDetails('xpath', "//*[@id='job-medium']", 'Job Icon');
    
        this.NotificationIcon = new LocatorsDetails('xpath', "//a[contains(@href, '/notifications/')]//li-icon[@type='bell-fill']", 'Notification Icon');
        this.viewJobsButton = new LocatorsDetails('xpath', "//span[@class='artdeco-button__text']//span[1]", 'View Jobs Button');

        // Search locators
        this.TitleOfJob = new LocatorsDetails('xpath', "//input[@placeholder='Describe the job you want']", 'Title of the Job Input');
        
        this.LocationOfJob = new LocatorsDetails('xpath', "//input[@aria-label=\"City, state, or zip code\" and contains(@id, 'jobs-search-box-location-id-')]", 'Location of the Job');
        this.SearchBox = new LocatorsDetails('xpath', "//button[text()='Search']", 'Search Box');

        // Filters
        this.EasyApplyFilter = new LocatorsDetails('xpath', "//button[@aria-label='Easy Apply filter.']", 'Easy Apply Filter');
        this.DatePostedButton = new LocatorsDetails('xpath', "//button[text()='Date posted']", 'Date Posted button');
        this.PastWeekButton = new LocatorsDetails('xpath', "//span[text()='Past week']", 'Past Week');
        this.AllFiltersButton = new LocatorsDetails('xpath', "//button[text()='All filters']", 'All filters Button');
        this.JobTitleFilter = new LocatorsDetails('xpath', "//h3[text()='Title']", 'Job Title Filter');
        this.JobTitleCheckbox = new LocatorsDetails('xpath', "//h3[text()='Title']/ancestor::fieldset//input[@name='title-filter-value']", 'Jobs Title Check Boxes');
        this.ShowAllResults = new LocatorsDetails('xpath', "//button[@data-test-reusables-filters-modal-show-results-button='true']", 'Show All results Button');

        // Job list
        this.listOfJobs = new LocatorsDetails('xpath', "//span[normalize-space()='Easy Apply']/ancestor::li[1]", 'List of Jobs');
        this.listOfJobsFrame = new LocatorsDetails('cssselector', '.scaffold-layout__list .jobs-search-results-list', 'List of Jobs Frame');
        this.listOfPages = new LocatorsDetails('xpath', "//ul[@class='artdeco-pagination__pages artdeco-pagination__pages--number']//li//button[contains(@aria-label, 'Page')]", 'List of Pages');
        this.nextPage1 = new LocatorsDetails('xpath', "//button[@aria-label='View next page']", 'Next Button');

        // Application buttons
        this.easyApplyButton = new LocatorsDetails('xpath', "//button[contains(normalize-space(@class), 'jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view')]//span[text()='Easy Apply']", 'Easy Apply button');
        this.continueButton = new LocatorsDetails('xpath', "//div[@class='display-flex']//button//span[text()='Continue']", 'Continue button');
        this.continueApplyingButton = new LocatorsDetails('xpath', "//span[@class='artdeco-button__text' and text()='Continue applying']", 'Continue applying button');
        this.nextButton = new LocatorsDetails('xpath', "//button[@aria-label='Continue to next step']//span[text()='Next']", 'Next button');
        this.reviewButton = new LocatorsDetails('xpath', "//span[text()='Review']", 'Review Button');
        this.submitApplicationButton = new LocatorsDetails('xpath', "//span[text()='Submit application']", 'Submit Application button');
        this.DoneButton = new LocatorsDetails('xpath', "//span[text()='Done']", 'Done button');
        this.closeIcon = new LocatorsDetails('xpath', "//div[@aria-labelledby=\"post-apply-modal\"]//*[name()='svg'and @data-test-icon=\"close-medium\"]", 'Close Icon');
        this.discard = new LocatorsDetails('xpath', "//button[@data-control-name='discard_application_confirm_btn']//span[text()='Discard']", 'Discard Button');

        // Form elements
        this.AnswerTextfield = new LocatorsDetails('xpath', "//div[@class='artdeco-text-input--container ember-view']//input[@type='text']", 'List of answers Textfield');
        this.textAreaFiled = new LocatorsDetails('xpath', "//textarea[contains(@class, 'artdeco-text-input__textarea') and @required]", 'Text Area Filed');
        this.Questions1 = new LocatorsDetails('xpath', "//div[@class='artdeco-text-input--container ember-view']//label[@class='artdeco-text-input--label']", 'All Questions');
        this.Question2 = new LocatorsDetails('xpath', "//span[@class='jobs-easy-apply-form-section__group-title t-14']", 'All Questions');
        this.cityName = new LocatorsDetails('xpath', "//input[contains(@id, 'location-GEO-LOCATION') or contains(@id, 'city-HOME-CITY')]", 'Enter City Name');
        this.DateTextField = new LocatorsDetails('xpath', "//input[@placeholder='mm/dd/yyyy']", 'Date Text field');

        // Radio, checkbox, dropdown
        this.radioButtons = new LocatorsDetails('xpath', ".//input[@type='radio' and @value='Yes']", 'Radio button');
        this.radioGroups = new LocatorsDetails('xpath', "//fieldset[@data-test-form-builder-radio-button-form-component='true']", 'Radio Groups');
        this.checkBox = new LocatorsDetails('xpath', "//input[@type='checkbox' and contains(@class, 'fb-form-element__checkbox')]", 'List of Checkbox');
        this.dropdownButtons = new LocatorsDetails('xpath', "//span[@class='visually-hidden']//following::select", 'List of DropDowns');

        // Job info
        this.JobTitle = new LocatorsDetails('xpath', "//h2[@id='jobs-apply-header']", 'Job Name');
        this.reachedMaxLimit = new LocatorsDetails('xpath', "//span[text()='You've reached the Easy Apply application limit for today. Save this job and come back tomorrow to continue applying.']", 'Reached Max limit');

        // Profile
        this.profileIcon = new LocatorsDetails('xpath', "//span[@class='t-12 global-nav__primary-link-text' and text()='Me']", 'Profile Icon');
    }
}

module.exports = LinkedinLocators;
