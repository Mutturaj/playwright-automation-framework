# 🎯 Get Started with Playwright Learning

## Welcome! 👋

You now have **15 comprehensive test files** covering all essential Playwright topics for SDET interviews!

---

## 📂 Project Structure

```
playwright-learning/
│
├── README.md                          # Main guide with all topics
├── INTERVIEW-QUESTIONS.md             # Top 20 interview Q&A
├── QUICK-REFERENCE.md                 # Cheat sheet
├── GET-STARTED.md                     # This file
│
├── 01-basic-navigation/
│   └── 01-page-navigation.spec.ts     # Navigation basics
│
├── 02-locators/
│   └── 01-locator-strategies.spec.ts  # All locator types ⭐
│
├── 03-interactions/
│   ├── 01-clicks-and-typing.spec.ts   # Click, type, hover
│   ├── 02-checkboxes-radio.spec.ts    # Checkboxes & radio buttons
│   └── 03-dropdowns.spec.ts           # All dropdown types ⭐
│
├── 04-waits/
│   └── 01-all-wait-types.spec.ts      # All wait strategies ⭐⭐⭐
│
├── 05-screenshots/
│   └── 01-screenshots.spec.ts         # Screenshots & visual testing
│
├── 06-scroll/
│   └── 01-scroll-operations.spec.ts   # Scroll operations
│
├── 07-iframes/
│   └── 01-iframe-handling.spec.ts     # IFrame handling ⭐
│
├── 08-hooks/
│   └── 01-test-hooks.spec.ts          # Test hooks ⭐⭐
│
├── 09-lists-tables/
│   ├── 01-handle-lists.spec.ts        # Working with lists ⭐⭐
│   └── 02-handle-tables.spec.ts       # Working with tables
│
├── 10-parallel-execution/
│   └── 01-parallel-tests.spec.ts      # Parallel testing ⭐
│
├── 11-api-testing/
│   └── 01-api-basics.spec.ts          # API testing ⭐
│
├── 12-dialogs-alerts/
│   └── 01-handle-dialogs.spec.ts      # Alerts, confirms, prompts
│
└── 13-tabs-windows/
    └── 01-switch-tabs-windows.spec.ts # Multiple tabs & windows ⭐⭐
```

⭐ = Important for interviews  
⭐⭐ = Very important  
⭐⭐⭐ = Critical (most asked!)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Update Playwright Config

Edit [playwright.config.js](../playwright.config.js) to include the learning folder:

```javascript
module.exports = defineConfig({
  testDir: './playwright-learning',  // Add this line
  fullyParallel: true,
  workers: 4,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

### Step 2: Run Your First Test

```bash
# Run a single test file
npx playwright test playwright-learning/01-basic-navigation/01-page-navigation.spec.ts

# Or run with UI mode (Recommended for learning!)
npx playwright test playwright-learning/01-basic-navigation/01-page-navigation.spec.ts --ui
```

### Step 3: Explore!

Open the test file in VS Code and read the comments, then run it!

---

## 📚 Learning Path

### 🎯 For Complete Beginners (Week 1)

**Day 1-2: Navigation & Locators**
```bash
npx playwright test playwright-learning/01-basic-navigation/ --ui
npx playwright test playwright-learning/02-locators/ --ui
```

**Day 3-4: Basic Interactions**
```bash
npx playwright test playwright-learning/03-interactions/01-clicks-and-typing.spec.ts --ui
npx playwright test playwright-learning/03-interactions/02-checkboxes-radio.spec.ts --ui
```

**Day 5: Dropdowns**
```bash
npx playwright test playwright-learning/03-interactions/03-dropdowns.spec.ts --ui
```

**Day 6-7: Waits (MOST IMPORTANT!)**
```bash
npx playwright test playwright-learning/04-waits/ --ui
```

### 🎯 Intermediate Level (Week 2)

**Day 1: Screenshots**
```bash
npx playwright test playwright-learning/05-screenshots/ --headed
```

**Day 2: Scroll Operations**
```bash
npx playwright test playwright-learning/06-scroll/ --headed
```

**Day 3: IFrames**
```bash
npx playwright test playwright-learning/07-iframes/ --ui
```

**Day 4-5: Hooks**
```bash
npx playwright test playwright-learning/08-hooks/ --ui
```

**Day 6-7: Lists & Tables**
```bash
npx playwright test playwright-learning/09-lists-tables/ --ui
```

### 🎯 Advanced Level (Week 3)

**Day 1-2: Parallel Execution**
```bash
npx playwright test playwright-learning/10-parallel-execution/
```

**Day 3-4: API Testing**
```bash
npx playwright test playwright-learning/11-api-testing/
```

**Day 5: Dialogs & Alerts**
```bash
npx playwright test playwright-learning/12-dialogs-alerts/
```

**Day 6: Tabs & Windows**
```bash
npx playwright test playwright-learning/13-tabs-windows/ --ui
```

**Day 7: Practice & Interview Prep**
- Read [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md)
- Review [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
- Practice writing your own tests

---

## 🎯 For SDET Interview Preparation

### Must-Know Topics (Priority Order)

**1. Waits (⭐⭐⭐ CRITICAL)**
```bash
npx playwright test playwright-learning/04-waits/ --ui
```
Why: Most asked in interviews! Know auto-waiting vs explicit waits.

**2. Locators (⭐⭐⭐ CRITICAL)**
```bash
npx playwright test playwright-learning/02-locators/ --ui
```
Why: Foundation of everything. Know best practices.

**3. Hooks (⭐⭐ VERY IMPORTANT)**
```bash
npx playwright test playwright-learning/08-hooks/ --ui
```
Why: Test organization, setup/teardown patterns.

**4. Lists & Tables (⭐⭐ VERY IMPORTANT)**
```bash
npx playwright test playwright-learning/09-lists-tables/ --ui
```
Why: Common real-world scenarios.

**5. Dropdowns (⭐⭐ VERY IMPORTANT)**
```bash
npx playwright test playwright-learning/03-interactions/03-dropdowns.spec.ts --ui
```
Why: Standard interview question.

**6. IFrames (⭐ IMPORTANT)**
```bash
npx playwright test playwright-learning/07-iframes/ --ui
```
Why: Frequently asked "how to handle iframes?"

**7. Parallel Execution (⭐ IMPORTANT)**
```bash
npx playwright test playwright-learning/10-parallel-execution/
```
Why: Performance optimization topic.

**8. API Testing (⭐ IMPORTANT)**
```bash
npx playwright test playwright-learning/11-api-testing/
```
Why: Modern testing includes API validation.

**9. Tabs & Windows (⭐⭐ VERY IMPORTANT)**
```bash
npx playwright test playwright-learning/13-tabs-windows/ --ui
```
Why: Common scenario - handling multiple tabs, popups.

---

## 💡 Useful Commands

### Run Tests

```bash
# Run all learning tests
npx playwright test playwright-learning/

# Run specific folder
npx playwright test playwright-learning/04-waits/

# Run specific file
npx playwright test playwright-learning/04-waits/01-all-wait-types.spec.ts

# Run tests matching name
npx playwright test -g "dropdown"
npx playwright test -g "wait"

# Run with UI mode (Best for learning!)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Debug mode
npx playwright test --debug

# Run with 1 worker (serial)
npx playwright test --workers=1

# Generate HTML report
npx playwright test
npx playwright show-report
```

### Create Screenshots Folder

Some tests save screenshots. Create the folder:

```bash
mkdir -p playwright-learning/screenshots
mkdir -p playwright-learning/screenshots/hooks
mkdir -p playwright-learning/screenshots/report
```

---

## 📖 Documentation Files

### 1. [README.md](./README.md)
- Complete guide with all topics
- File references and explanations
- Best practices
- Learning roadmap

### 2. [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md)
- Top 20 interview questions
- Detailed answers with code
- Real interview scenarios
- Preparation checklist

### 3. [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
- Cheat sheet for quick lookup
- Copy-paste ready code snippets
- All common operations
- Print and keep handy!

---

## 🎨 Running in Different Modes

### UI Mode (Recommended for Learning)
```bash
npx playwright test playwright-learning/04-waits/ --ui
```
**Benefits:**
- See test execution step by step
- Time travel through test steps
- Inspect elements
- See console logs
- Great for understanding

### Headed Mode (See Browser)
```bash
npx playwright test playwright-learning/04-waits/ --headed
```
**Benefits:**
- Watch tests run in real browser
- See actual user interactions
- Useful for debugging

### Debug Mode
```bash
npx playwright test playwright-learning/04-waits/ --debug
```
**Benefits:**
- Playwright Inspector opens
- Step through tests
- Inspect locators
- Modify selectors on the fly

### Default Mode (Headless)
```bash
npx playwright test playwright-learning/04-waits/
```
**Benefits:**
- Fast execution
- CI/CD ready
- No browser window

---

## 🔥 Practice Exercises

### Exercise 1: Basic Test
Write a test that:
1. Navigates to https://demo.playwright.dev/todomvc
2. Adds 3 todo items
3. Marks the second one as complete
4. Verifies there are 3 items total

### Exercise 2: API + UI Test
Write a test that:
1. Creates a user via API (POST)
2. Logs in with that user (UI)
3. Verifies dashboard shows user info

### Exercise 3: Data-Driven Test
Write a test that:
1. Loops through array of test data
2. Fills a form with each data set
3. Validates results

---

## 🐛 Common Issues & Solutions

### Issue 1: Tests failing with timeout
**Solution:** Check waits - might need `waitForLoadState('networkidle')`

### Issue 2: Element not found
**Solution:** 
- Use UI mode to inspect: `npx playwright test --ui`
- Check selector in Playwright Inspector
- Try different locator strategy

### Issue 3: Flaky tests
**Solution:**
- Avoid `waitForTimeout`
- Use proper waits (`waitForSelector`, auto-waiting)
- Check for race conditions

### Issue 4: Can't find iframe content
**Solution:**
- Use `frameLocator()` instead of `locator()`
- Example: `page.frameLocator('#iframe').locator('#button')`

---

## 📊 Track Your Progress

- [ ] Completed 01-basic-navigation
- [ ] Completed 02-locators ⭐
- [ ] Completed 03-interactions (all 3 files)
- [ ] Completed 04-waits ⭐⭐⭐ (CRITICAL!)
- [ ] Completed 05-screenshots
- [ ] Completed 06-scroll
- [ ] Completed 07-iframes ⭐
- [ ] Completed 08-hooks ⭐⭐
- [ ] Completed 09-lists-tables ⭐⭐
- [ ] Completed 10-parallel-execution ⭐
- [ ] Completed 11-api-testing ⭐
- [ ] Completed 12-dialogs-alerts
- [ ] Completed 13-tabs-windows ⭐⭐
- [ ] Read INTERVIEW-QUESTIONS.md
- [ ] Printed QUICK-REFERENCE.md
- [ ] Can write tests without looking at examples
- [ ] Ready for SDET interview! 🚀

---

## 🎓 Next Steps

1. **Read** [README.md](./README.md) for complete overview
2. **Run** tests with `--ui` mode to understand execution
3. **Modify** examples to experiment
4. **Create** your own test scenarios
5. **Review** [INTERVIEW-QUESTIONS.md](./INTERVIEW-QUESTIONS.md) before interviews
6. **Keep** [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) handy while coding

---

## 💪 You've Got This!

You now have:
- ✅ 15 comprehensive test files
- ✅ 200+ real-world examples
- ✅ Interview questions with answers
- ✅ Quick reference cheat sheet
- ✅ Complete learning path
- ✅ Best practices guide

**Start learning, practice daily, and ace that SDET interview! 🎯**

---

## 📞 Getting Help

If stuck:
1. Read the code comments (very detailed!)
2. Run test in UI mode: `npx playwright test --ui`
3. Check [Playwright Docs](https://playwright.dev/)
4. Use debug mode: `npx playwright test --debug`

---

**Happy Learning! 🎭 Good Luck! 🚀**
