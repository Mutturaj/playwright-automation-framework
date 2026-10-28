# 🎭 Playwright Learning Guide for SDET Interviews

**Complete TypeScript-based Playwright automation framework with real-world examples**

Welcome! This comprehensive guide covers everything you need to master Playwright for SDET interviews and automation testing.

---

## 📚 Table of Contents

### 1. **Basic Navigation** (`01-basic-navigation/`)
- [01-page-navigation.spec.ts](./01-basic-navigation/01-page-navigation.spec.ts)
  - Navigate to URLs
  - Browser history (back, forward)
  - Page reload
  - Wait conditions (load, networkidle, domcontentloaded)
  - Get page metadata

### 2. **Locators** (`02-locators/`)
- [01-locator-strategies.spec.ts](./02-locators/01-locator-strategies.spec.ts)
  - Locate by Role (Recommended ✅)
  - Locate by Text
  - Locate by Label
  - Locate by Placeholder
  - Locate by Test ID (Best Practice ✅)
  - CSS Selectors
  - XPath
  - Chaining and Filtering
  - Nested locators

### 3. **User Interactions** (`03-interactions/`)
- [01-clicks-and-typing.spec.ts](./03-interactions/01-clicks-and-typing.spec.ts)
  - Click actions (single, double, right-click)
  - Fill and type text
  - Keyboard shortcuts
  - Hover, drag & drop
  - Focus and blur
- [02-checkboxes-radio.spec.ts](./03-interactions/02-checkboxes-radio.spec.ts)
  - Check/uncheck checkboxes
  - Radio button selection
  - Multiple selections
- [03-dropdowns.spec.ts](./03-interactions/03-dropdowns.spec.ts)
  - Standard HTML dropdowns
  - Select by text, value, index
  - Multi-select
  - Custom dropdowns
  - Cascading dropdowns

### 4. **Waits** (`04-waits/`) ⏱️ **MOST ASKED IN INTERVIEWS!**
- [01-all-wait-types.spec.ts](./04-waits/01-all-wait-types.spec.ts)
  - Auto-waiting (Built-in) ✅
  - waitForSelector
  - waitForLoadState
  - waitForURL
  - waitForResponse
  - waitForRequest
  - waitForFunction
  - waitForTimeout (avoid when possible ❌)
  - Custom wait conditions

### 5. **Screenshots** (`05-screenshots/`)
- [01-screenshots.spec.ts](./05-screenshots/01-screenshots.spec.ts)
  - Full page screenshots
  - Element screenshots
  - Screenshot options (quality, format)
  - Visual regression testing
  - Screenshots on failure

### 6. **Scroll Operations** (`06-scroll/`)
- [01-scroll-operations.spec.ts](./06-scroll/01-scroll-operations.spec.ts)
  - Scroll to element
  - Scroll to top/bottom
  - Scroll by pixels
  - Smooth scrolling
  - Infinite scroll
  - Lazy loading

### 7. **IFrames** (`07-iframes/`)
- [01-iframe-handling.spec.ts](./07-iframes/01-iframe-handling.spec.ts)
  - Locate iframes by name/URL
  - frameLocator (Modern API ✅)
  - Nested iframes
  - Switch between parent and iframe
  - Payment gateway, social embeds

### 8. **Hooks** (`08-hooks/`) 🎣 **CRITICAL FOR INTERVIEWS!**
- [01-test-hooks.spec.ts](./08-hooks/01-test-hooks.spec.ts)
  - beforeEach / afterEach
  - beforeAll / afterAll
  - Nested hooks
  - Setup and teardown
  - Login before tests
  - Screenshots in hooks

### 9. **Lists & Tables** (`09-lists-tables/`)
- [01-handle-lists.spec.ts](./09-lists-tables/01-handle-lists.spec.ts)
  - Count elements
  - Access by index (first, last, nth)
  - Iterate through lists
  - Filter and search
  - Dynamic lists
- [02-handle-tables.spec.ts](./09-lists-tables/02-handle-tables.spec.ts)
  - Count rows and columns
  - Access specific cells
  - Extract table data
  - Search in tables
  - Click buttons in rows
  - Sort tables

### 10. **Parallel Execution** (`10-parallel-execution/`) ⚡
- [01-parallel-tests.spec.ts](./10-parallel-execution/01-parallel-tests.spec.ts)
  - Default parallel behavior
  - Serial execution (.serial)
  - Configure workers
  - Fully parallel mode
  - Best practices

### 11. **API Testing** (`11-api-testing/`) 🌐
- [01-api-basics.spec.ts](./11-api-testing/01-api-basics.spec.ts)
  - GET requests
  - POST requests
  - PUT/PATCH requests
  - DELETE requests
  - Response validation
  - Error handling
  - Complete CRUD workflow
  - Authentication (Bearer token, Basic Auth)

### 12. **Dialogs & Alerts** (`12-dialogs-alerts/`)
- [01-handle-dialogs.spec.ts](./12-dialogs-alerts/01-handle-dialogs.spec.ts)
  - Alert dialogs
  - Confirm dialogs (Accept/Dismiss)
  - Prompt dialogs (with input)
  - beforeunload dialogs
  - Multiple dialogs

### 13. **Tabs & Windows** (`13-tabs-windows/`) ⭐⭐
- [01-switch-tabs-windows.spec.ts](./13-tabs-windows/01-switch-tabs-windows.spec.ts)
  - Open new tabs and windows
  - Switch between multiple tabs
  - Get all open pages
  - Close specific tabs
  - Handle popups
  - Real-world tab scenarios

---

## 🚀 Getting Started

### Prerequisites
```bash
# Already installed in your project:
- Node.js
- Playwright @playwright/test
- TypeScript
```

### Run Individual Test Files

```bash
# Run a specific test file
npx playwright test playwright-learning/01-basic-navigation/01-page-navigation.spec.ts

# Run tests in a folder
npx playwright test playwright-learning/04-waits/

# Run with UI mode (recommended for learning)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run with specific browser
npx playwright test --project=chromium
```

### Run Tests by Name

```bash
# Run tests matching a pattern
npx playwright test -g "click"

# Run tests in a specific describe block
npx playwright test -g "Basic List Operations"
```

---

## 📖 How to Use This Guide

### For Beginners:
1. **Start with:** `01-basic-navigation` → `02-locators` → `03-interactions`
2. **Then learn:** `04-waits` (VERY IMPORTANT! ⭐)
3. **Practice:** `08-hooks` → `09-lists-tables`
4. **Advanced:** `10-parallel-execution` → `11-api-testing`

### For Interview Preparation:
**Focus on these topics (Most Asked):**
1. ⭐ **Waits** (`04-waits`) - Different types, when to use
2. ⭐ **Locators** (`02-locators`) - Best practices, test-id
3. ⭐ **Hooks** (`08-hooks`) - beforeEach, afterEach, setup/teardown
4. ⭐ **Handling Lists** (`09-lists-tables`) - Iterate, filter, extract data
5. ⭐ **Dropdowns** (`03-interactions/03-dropdowns`) - All types
6. ⭐ **IFrames** (`07-iframes`) - frameLocator usage
7. ⭐ **Tabs & Windows** (`13-tabs-windows`) - Switch tabs, handle popups
8. ⭐ **API Testing** (`11-api-testing`) - GET, POST, validation
9. ⭐ **Parallel Execution** (`10-parallel-execution`) - Workers, serial vs parallel

### Practice Strategy:
1. **Read** the file (understand concepts)
2. **Run** the test (`npx playwright test <file>`)
3. **Modify** examples (change values, add assertions)
4. **Create** your own test scenarios
5. **Debug** with `--ui` or `--headed` mode

---

## 🎯 SDET Interview Question Coverage

### Common Questions Covered:

1. **"How do you handle waits in Playwright?"**
   - See: `04-waits/01-all-wait-types.spec.ts`
   - Answer: Auto-waiting, waitForSelector, waitForLoadState

2. **"How to select an element in Playwright?"**
   - See: `02-locators/01-locator-strategies.spec.ts`
   - Answer: getByRole, getByTestId, CSS, XPath

3. **"How to handle dropdowns?"**
   - See: `03-interactions/03-dropdowns.spec.ts`
   - Answer: selectOption by text/value/index, custom dropdowns

4. **"What are hooks in Playwright?"**
   - See: `08-hooks/01-test-hooks.spec.ts`
   - Answer: beforeEach, afterEach, beforeAll, afterAll

5. **"How to handle iframes?"**
   - See: `07-iframes/01-iframe-handling.spec.ts`
   - Answer: frameLocator(), frame() method

6. **"How to handle multiple elements/lists?"**
   - See: `09-lists-tables/01-handle-lists.spec.ts`
   - Answer: count(), nth(), first(), last(), iterate

7. **"How to take screenshots?"**
   - See: `05-screenshots/01-screenshots.spec.ts`
   - Answer: page.screenshot(), element.screenshot()

8. **"Explain parallel execution"**
   - See: `10-parallel-execution/01-parallel-tests.spec.ts`
   - Answer: Workers, .serial, fullyParallel

9. **"How to do API testing?"**
   - See: `11-api-testing/01-api-basics.spec.ts`
   - Answer: request fixture, GET/POST/PUT/DELETE

10. **"How to handle alerts and dialogs?"**
    - See: `12-dialogs-alerts/01-handle-dialogs.spec.ts`
    - Answer: page.on('dialog'), accept(), dismiss()

11. **"How to switch between tabs/windows?"**
    - See: `13-tabs-windows/01-switch-tabs-windows.spec.ts`
    - Answer: context.waitForEvent('page'), context.newPage(), page.bringToFront()

---

## ⚙️ Configuration

### Update `playwright.config.js`:

```javascript
module.exports = defineConfig({
  testDir: './playwright-learning',  // Point to learning folder
  fullyParallel: true,
  workers: 4,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

---

## 🔧 Useful Commands

```bash
# Run all learning tests
npx playwright test playwright-learning/

# Run with UI mode (Interactive)
npx playwright test --ui

# Run in debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Generate HTML report
npx playwright test
npx playwright show-report

# Run with specific workers (parallel)
npx playwright test --workers=4

# Run serially (one at a time)
npx playwright test --workers=1

# Run tests matching pattern
npx playwright test -g "screenshot"
```

---

## 📝 Best Practices Covered

✅ **Use getByRole() and getByTestId()** - Most reliable  
✅ **Leverage auto-waiting** - Avoid hard waits  
✅ **Write independent tests** - No shared state  
✅ **Use hooks for setup/teardown** - Clean code  
✅ **Take screenshots on failure** - Better debugging  
✅ **Run tests in parallel** - Faster execution  
✅ **Use TypeScript** - Type safety  
✅ **Validate API responses** - Comprehensive testing  
✅ **Handle errors gracefully** - Robust tests  
✅ **Use descriptive test names** - Better readability  

---

## 🎓 Learning Path

### Week 1: Foundations
- Day 1-2: Navigation + Locators
- Day 3-4: Interactions (clicks, typing, checkboxes)
- Day 5: Dropdowns
- Day 6-7: Waits (MOST IMPORTANT!)

### Week 2: Intermediate
- Day 1: Screenshots + Scroll
- Day 2-3: IFrames
- Day 4-5: Hooks
- Day 6-7: Lists and Tables

### Week 3: Advanced
- Day 1-2: Parallel Execution
- Day 3-4: API Testing
- Day 5: Dialogs and Alerts
- Day 6-7: Practice & Review

---

## 🐛 Debugging Tips

1. **Use UI Mode:**
   ```bash
   npx playwright test --ui
   ```

2. **Use Debug Mode:**
   ```bash
   npx playwright test --debug
   ```

3. **Add Console Logs:**
   ```typescript
   console.log('Current URL:', page.url());
   console.log('Element count:', await elements.count());
   ```

4. **Take Screenshots:**
   ```typescript
   await page.screenshot({ path: 'debug.png' });
   ```

5. **Use page.pause():**
   ```typescript
   await page.pause(); // Pauses execution for manual inspection
   ```

---

## 📊 Test Reports

After running tests:

```bash
# View HTML report
npx playwright show-report

# Report includes:
- Test results (passed/failed)
- Screenshots (on failure)
- Videos (on failure)
- Traces (on failure)
- Execution time
```

---

## 🤝 Contributing

Feel free to add more examples or improve existing ones!

---

## 📚 Additional Resources

- [Playwright Official Docs](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Checklist for Interview Readiness

- [ ] Can write tests using different locator strategies
- [ ] Understand all types of waits (auto-wait, explicit waits)
- [ ] Can handle dropdowns (standard & custom)
- [ ] Know how to use hooks (beforeEach, afterEach, etc.)
- [ ] Can work with lists and tables (iterate, filter, extract)
- [ ] Can handle iframes using frameLocator
- [ ] Understand parallel vs serial execution
- [ ] Can write API tests (GET, POST, PUT, DELETE)
- [ ] Can handle alerts, confirms, and prompts
- [ ] Can take screenshots and use them for debugging
- [ ] Understand Playwright configuration
- [ ] Can explain Playwright best practices

---

## 🎉 You're Ready!

Once you've covered all topics and practiced the examples, you'll be well-prepared for SDET interviews!

**Good luck with your learning journey! 🚀**

---

## 📧 Questions?

If you have questions about any examples:
1. Read the code comments (detailed explanations included)
2. Run the test in UI mode (`--ui`)
3. Check Playwright docs
4. Experiment and modify the code!

**Happy Testing! 🎭**
