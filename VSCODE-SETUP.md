# VS Code Setup for Playwright IntelliSense & Navigation

## ✅ Configuration Files Created

I've created the following configuration files for you:

1. **`jsconfig.json`** - For JavaScript files (tests/*.js)
2. **`playwright-learning/tsconfig.json`** - For TypeScript files (*.spec.ts)
3. **`.vscode/settings.json`** - VS Code workspace settings
4. **`.vscode/extensions.json`** - Recommended extensions

## 🔧 Quick Fix Steps

### Step 1: Reload VS Code Window

Press **`Ctrl+Shift+P`** and type:
```
> Developer: Reload Window
```

Or close and reopen VS Code.

### Step 2: Install Playwright Extension (if not installed)

1. Open Extensions: **`Ctrl+Shift+X`**
2. Search: **"Playwright Test for VSCode"**
3. Install: **ms-playwright.playwright**
4. Reload VS Code

### Step 3: Select TypeScript Version (if needed)

1. Open any `.ts` file in `playwright-learning/`
2. Press **`Ctrl+Shift+P`**
3. Type: **`TypeScript: Select TypeScript Version`**
4. Choose: **"Use Workspace Version"**

### Step 4: Test Ctrl+Click

Now try in your test files:

**In TypeScript files (playwright-learning):**
- Hover over `test` → should show type info
- Ctrl+Click on `page.goto()` → should jump to definition
- Ctrl+Click on `expect` → should jump to definition

**In JavaScript files (tests/):**
- Hover over functions → should show JSDoc
- Ctrl+Click on Playwright methods → should work

## 🎯 What Should Work Now

### ✅ IntelliSense (Auto-complete)

Type `page.` and you should see:
- `goto()`
- `locator()`
- `click()`
- etc.

### ✅ Go to Definition (Ctrl+Click)

Ctrl+Click should work on:
- Playwright methods (`page.goto`, `locator`, etc.)
- `test` function
- `expect` assertions
- Your custom functions

### ✅ Type Hints

Hover over any Playwright method to see:
- Parameter types
- Return types
- Documentation

## 🐛 If It Still Doesn't Work

### Problem: No IntelliSense

**Solution:**
```bash
# Reinstall Playwright types
npm install --save-dev @playwright/test @types/node

# Reload VS Code
Ctrl+Shift+P > Developer: Reload Window
```

### Problem: Ctrl+Click doesn't work

**Solution 1: Check file type**
- Make sure file has correct extension (`.ts` for TypeScript, `.js` for JavaScript)
- Bottom-right corner should show "TypeScript" or "JavaScript"

**Solution 2: Restart TypeScript server**
- Press `Ctrl+Shift+P`
- Type: `TypeScript: Restart TS Server`

### Problem: "Cannot find module '@playwright/test'"

**Solution:**
```bash
# Install dependencies
npm install

# Or specifically install Playwright
npm install --save-dev @playwright/test
```

## 📝 Verify Setup

### Test 1: Hover works?

In any `.spec.ts` file, hover over `page`:
```typescript
test('example', async ({ page }) => {
  // Hover over 'page' above - should show: "page: Page"
});
```

### Test 2: Ctrl+Click works?

Ctrl+Click on `goto`:
```typescript
await page.goto('https://example.com');
//         ^^^^ Ctrl+Click here
```

Should jump to Playwright's definition.

### Test 3: Auto-complete works?

Type this and wait for suggestions:
```typescript
await page.
//         ^ Cursor here - should show methods
```

## 🎨 Bonus: Playwright Test Runner in VS Code

With the Playwright extension installed:

1. **Test Explorer**: View → Testing (or Ctrl+Shift+T)
2. **Run tests**: Click ▶️ next to test name
3. **Debug tests**: Click 🐛 debug icon
4. **Pick locator**: Use locator picker tool

## ⚙️ VS Code Settings Explained

**`.vscode/settings.json`** includes:
- ✅ Auto-imports enabled
- ✅ Format on save
- ✅ Playwright integration
- ✅ TypeScript/JavaScript suggestions

**`jsconfig.json`** enables:
- ✅ IntelliSense for JavaScript files
- ✅ Type checking for `.js` files
- ✅ Node.js and Playwright types

**`playwright-learning/tsconfig.json`** enables:
- ✅ TypeScript compilation
- ✅ Strict type checking
- ✅ Playwright types

## 🎯 Expected Behavior

### When working correctly:

**Hovering** over code:
- Shows type information
- Shows parameter hints
- Shows documentation

**Ctrl+Click** on:
- Jumps to definition
- Works for all Playwright APIs
- Works for your custom functions

**Typing** code:
- Auto-complete suggestions
- Import suggestions
- Parameter hints while typing

## ✅ Checklist

- [ ] Reloaded VS Code window
- [ ] Installed Playwright extension
- [ ] Selected workspace TypeScript version
- [ ] IntelliSense works (shows suggestions)
- [ ] Ctrl+Click works (jumps to definitions)
- [ ] Hover shows type information

## 🚀 Quick Test

Try this in a `.spec.ts` file:

```typescript
import { test, expect } from '@playwright/test';

test('verify setup', async ({ page }) => {
  // 1. Hover over 'page' - should show type
  // 2. Ctrl+Click on 'goto' - should jump to definition
  await page.goto('https://playwright.dev/');
  
  // 3. Type 'page.' - should show auto-complete
  // 4. Hover over 'expect' - should show docs
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

**Still having issues?** Make sure:
1. You're in the correct workspace folder
2. `node_modules` exists (run `npm install`)
3. VS Code has been reloaded after config changes

**Everything working?** You're all set! 🎉
