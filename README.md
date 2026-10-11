# Auto Job Apply - Playwright + JavaScript

Automated job application system for LinkedIn and Naukri using Playwright and JavaScript. This is a complete migration from the Java + Selenium version with all functionality preserved.

## Features

### LinkedIn Automation
- ✅ Automatic login
- ✅ Job search with custom queries
- ✅ Apply for jobs from search results
- ✅ Apply for jobs from recommended collection
- ✅ Apply for jobs from notifications
- ✅ Easy Apply filter support
- ✅ Dynamic form filling (text, radio, checkbox, dropdown, date)
- ✅ Question-answer mapping from dataset
- ✅ Pagination support
- ✅ Application limit detection
- ✅ Automatic logout

### Naukri Automation
- ✅ Automatic login
- ✅ Profile update
- ✅ Apply for recommended jobs
- ✅ Job search with filters
- ✅ Chatbot interaction handling
- ✅ Dynamic form filling
- ✅ DOB field handling
- ✅ Multiple window/tab handling
- ✅ Promotional popup handling
- ✅ Application limit detection

## Project Structure

```
c:\Projects\PracticeJavascript
├── src/
│   ├── pages/
│   │   ├── LinkedinPage.js       # LinkedIn automation logic
│   │   └── NaukriPage.js         # Naukri automation logic
│   ├── locators/
│   │   ├── LinkedinLocators.js   # LinkedIn element locators
│   │   └── NaukriLocators.js     # Naukri element locators
│   └── utils/
│       ├── GenericMethods.js     # Reusable utility methods
│       ├── LocatorsDetails.js    # Locator wrapper class
│       ├── QuestionAnswerHandler.js  # Q&A mapping logic
│       ├── DataConfig.js         # Dataset configuration
│       └── dataRead.js           # Dataset reader
├── tests/
│   ├── LinkedinTest.spec.js      # LinkedIn test suite
│   └── NaukriTest.spec.js        # Naukri test suite
├── dataset.json                  # User data and Q&A mappings
├── playwright.config.js          # Playwright configuration
├── package.json                  # Node dependencies
├── screenshots/                  # Screenshot output folder
└── allure-results/              # Allure test results

```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
```bash
cd c:\Projects\PracticeJavascript
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install chromium
```

3. **Update dataset.json:**
   - Edit `dataset.json` with your credentials
   - Add/update question-answer mappings
   - Configure job search criteria

## Configuration

### Dataset.json Structure

```json
{
  "datasets": [
    {
      "name": "YourName",
      "data": {
        "EmailID": "your.email@example.com",
        "Password": "YourPassword",
        "LinkedInJobTitle": "SDET OR QA Engineer Easy Apply",
        "NaukriJobTitle": "sdet software test engineer",
        "JobLocation": "Karnataka, India",
        "Experience": "3",
        "Hiring Manager Message": "Hi, Please find my resume...",
        "years of experience": "3",
        "Mobile phone number": "1234567890",
        "First name": "Your",
        "Last name": "Name",
        "current ctc": "1000000",
        "expected ctc": "1500000",
        "notice period": "30",
        ...
      }
    }
  ]
}
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run LinkedIn tests only
```bash
npm run test:linkedin
```

### Run Naukri tests only
```bash
npm run test:naukri
```

### Run tests in parallel (2 workers)
```bash
npm run test:parallel
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug mode
```bash
npm run test:debug
```

### View HTML report
```bash
npm run report
```

### Generate Allure report
```bash
npm run allure:generate
npm run allure:open
```

## Key Differences from Java Version

### ✅ Improvements
1. **Faster Execution** - Playwright is generally faster than Selenium
2. **Better Error Handling** - More descriptive error messages
3. **Auto-waiting** - Built-in smart waiting for elements
4. **Multiple Context Support** - Better handling of multiple windows/tabs
5. **Better Screenshot/Video** - Automatic capture on failures
6. **Modern JavaScript** - Async/await instead of callbacks
7. **Better Reporting** - HTML + Allure reports out of the box

### Functional Parity
- ✅ All login functionality preserved
- ✅ All job search and filtering preserved
- ✅ All form filling logic preserved
- ✅ All pagination logic preserved
- ✅ All question-answer mapping preserved
- ✅ All chatbot handling preserved
- ✅ All popup handling preserved
- ✅ All multi-window handling preserved

## Troubleshooting

### Tests failing to login
- Check if credentials in `dataset.json` are correct
- LinkedIn/Naukri may have CAPTCHA - run in headed mode to verify
- Check if you need to verify email/phone

### Element not found errors
- Locators may have changed - update in locators files
- Increase timeout in `playwright.config.js`

### Application limit reached
- LinkedIn has daily Easy Apply limits (~100-200 per day)
- Naukri also has application limits
- Tests will automatically stop when limit is reached

### Chatbot issues on Naukri
- Check question-answer mappings in `dataset.json`
- Add more mappings for new questions
- Enable debug logging to see question text

## Test Execution Flow

### LinkedIn
1. Login to LinkedIn
2. Navigate to Jobs section
3. Search for jobs (Test 1)
4. Apply for jobs from recommended collection (Test 2)
5. Apply for jobs from notifications (Test 3)
6. Logout (Test 4)

### Naukri
1. Login to Naukri
2. Update profile (refreshes timestamp)
3. Apply for recommended jobs (Test 2)
4. Search and apply for jobs (Test 3)

## Parallel Execution

Tests run in parallel by dataset name. Each user in `dataset.json` gets their own browser context to avoid conflicts.

## Reporting

### HTML Report
- Automatically generated after test run
- View with `npm run report`
- Includes screenshots, videos, traces

### Allure Report
- Generate with `npm run allure:generate`
- Open with `npm run allure:open`
- Detailed step-by-step execution
- Charts and statistics

## Best Practices

1. **Don't share credentials** - Keep `dataset.json` in `.gitignore`
2. **Respect rate limits** - Don't apply to too many jobs at once
3. **Monitor applications** - Check your email for responses
4. **Update resume** - Keep LinkedIn/Naukri profiles updated
5. **Customize search** - Tailor job search strings to your skills

## Maintenance

### Updating Locators
If LinkedIn/Naukri UI changes:
1. Update locators in `src/locators/LinkedinLocators.js` or `NaukriLocators.js`
2. Test individual methods in headed mode
3. Add alternative locators if needed

### Adding New Questions
When encountering new questions:
1. Note the question text from console logs
2. Add entry to `dataset.json` under your data section
3. Run tests again to verify

## Support

For issues or questions:
1. Check console logs for detailed errors
2. Run in headed mode to see what's happening
3. Enable Playwright trace for detailed debugging

## Migration Notes

This project has been fully migrated from Java + Selenium to JavaScript + Playwright with:
- ✅ 100% functional parity
- ✅ All features working as in original
- ✅ Improved error handling
- ✅ Better reporting
- ✅ Faster execution

All functionality from the original Java project is preserved and working.
