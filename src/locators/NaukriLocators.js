const LocatorsDetails = require('../utils/LocatorsDetails');

class NaukriLocators {
    constructor() {
        // Login locators
        this.EmailID = new LocatorsDetails('xpath', "//input[@placeholder='Enter your active Email ID / Username']", 'Email ID Input');
        this.Password = new LocatorsDetails('xpath', "//input[@placeholder='Enter your password']", 'Password Input');
        this.LoginButton = new LocatorsDetails('xpath', "//button[text()='Login']", 'Login Button');

        // Profile update
        this.EditIcon = new LocatorsDetails('xpath', "//em[@class='icon edit']", 'Edit Icon');
        this.SaveButton = new LocatorsDetails('xpath', "//button[contains(@class,'updateProfile')]", 'Save Button');

        // Navigation
        this.JobButton = new LocatorsDetails('xpath', "//a[text()='Jobs']", 'Job Button');
        this.SearchIcon1 = new LocatorsDetails('xpath', "//span[@class='nI-gNb-sb__placeholder']", 'Search Icon 1');
        this.SearchIcon2 = new LocatorsDetails('xpath', "//button[text()='Search']", 'Search Icon 2');

        // Search filters
        this.Designation = new LocatorsDetails('xpath', "//input[@placeholder='Enter keyword / designation / companies']", 'Designation Input');
        this.Location = new LocatorsDetails('xpath', "//input[@placeholder='Enter location']", 'Location Input');
        this.ExperienceButton = new LocatorsDetails('xpath', "//div[@class='dropdownMainContainer']//span[text()='Experience']", 'Experience Button');

        // Job list
        this.listOfJobs = new LocatorsDetails('xpath', "//div[@class='cust-job-tuple layout-wrapper lay-2 sjw__tuple ']", 'List of Jobs');
        this.listOfJobsFromSearch = new LocatorsDetails('xpath', "//article[@class='jobTuple bgWhite br4 mb-8']", 'List of Jobs From Search');
        this.ApplyButton = new LocatorsDetails('xpath', "//button[text()='Apply']", 'Apply Button');
        this.ApplyCompanySite = new LocatorsDetails('xpath', "//button[text()='Apply on company site']", 'Apply on Company Site Button');
        this.JobTitle = new LocatorsDetails('xpath', "//h1[@class='jd-header-title']", 'Job Title');

        // Pagination
        this.pageNum = new LocatorsDetails('xpath', "//div[@class='styles_pagination__oZVUR']//a", 'Page Numbers');

        // Chatbot
        this.chatBotPage = new LocatorsDetails('xpath', "//div[@class='chatBot chatBot-panel']", 'Chatbot Page');
        this.chatBotQuestion = new LocatorsDetails('xpath', "//p[@class='msg-text']", 'Chatbot Question');
        this.answerTextFiled = new LocatorsDetails('xpath', "//input[@type='text' and @class='inputBox']", 'Answer Text Field');
        this.RadioButtons = new LocatorsDetails('xpath', "//input[@type='radio']", 'Radio Buttons');
        this.checkbox = new LocatorsDetails('xpath', "//input[@type='checkbox']", 'Checkbox');
        this.yesButton = new LocatorsDetails('xpath', "//button[text()='Yes']", 'Yes Button');
        this.SearchFiled = new LocatorsDetails('xpath', "//input[@type='search']", 'Search Field');
        this.suggestionList = new LocatorsDetails('xpath', "//li[@class='suggestion']", 'Suggestion List');
        this.saveButtonContainer = new LocatorsDetails('xpath', "//div[@class='questionWrap']", 'Save Button Container');
        this.skipThisQues = new LocatorsDetails('xpath', "//a[text()='Skip this question']", 'Skip This Question');
        this.DOBfield = new LocatorsDetails('xpath', "//input[@type='tel']", 'DOB Field');

        // Limit reached
        this.ReachedMaxLimit = new LocatorsDetails('xpath', "//span[text()='You have reached the maximum application']", 'Reached Max Limit');
    }
}

module.exports = NaukriLocators;
