# Parallel Execution Guide

This guide explains how to run LinkedIn and Naukri job applications in parallel.

## Parallel Execution Modes

### Mode 1: Full Parallel Execution (LinkedIn + Naukri simultaneously)

This is the **RECOMMENDED** approach where both LinkedIn and Naukri tests run at the same time for each user.

```bash
# Run with 4 workers (LinkedIn + Naukri in parallel for each user)
npm run test:parallel

# Run with 8 workers (maximum parallelism)
npm run test:parallel:max

# Run all tests with default workers
npm run test:all
```

**How it works:**
- For each user in `dataset.json`, LinkedIn and Naukri tests run simultaneously
- If you have 3 users, you'll see 6 test suites running (3 LinkedIn + 3 Naukri)
- Each test suite runs independently in its own browser context

**Example with 2 users (Muttu and Bindu):**
```
✓ LinkedIn - Muttu    (running)
✓ Naukri - Muttu      (running)  ← Both run at the same time
✓ LinkedIn - Bindu    (running)
✓ Naukri - Bindu      (running)  ← Both run at the same time
```

### Mode 2: Separate Execution (LinkedIn OR Naukri)

Run only LinkedIn or only Naukri tests:

```bash
# Run only LinkedIn tests
npm run test:linkedin

# Run only Naukri tests
npm run test:naukri
```

### Mode 3: Sequential Execution (Headed Mode)

Run tests in headed mode (visible browser) for debugging:

```bash
# Run all tests in headed mode with 2 workers (LinkedIn + Naukri visible)
npm run test:headed:all

# Run all tests in headed mode with 1 worker (one at a time)
npm run test:headed
```

## Understanding Workers

**Workers** = Number of parallel test suites that can run simultaneously

| Workers | Description | Use Case |
|---------|-------------|----------|
| 1 | Sequential execution | Debugging, headed mode |
| 2 | 2 parallel tests | Low-end machines |
| 4 | 4 parallel tests (default) | **Recommended for most cases** |
| 8 | 8 parallel tests | High-end machines, fast execution |

## Execution Examples

### Example 1: Run All Users - LinkedIn and Naukri in Parallel

```bash
npm run test:parallel
```

**What happens:**
1. Muttu applies on LinkedIn (Browser 1)
2. Muttu applies on Naukri (Browser 2) ← **Simultaneously with #1**
3. Bindu applies on LinkedIn (Browser 3)
4. Bindu applies on Naukri (Browser 4) ← **Simultaneously with #3**
5. And so on...

### Example 2: Run in Headed Mode (See the browsers)

```bash
npm run test:headed:all
```

**What happens:**
- You'll see 2 browser windows open
- One doing LinkedIn automation
- One doing Naukri automation
- Both running at the same time

### Example 3: Debug Single User

To test with just one user before running all:

```bash
# Edit dataset.json - keep only ONE user in the datasets array
# Then run:
npm run test:headed:all
```

## Performance Tips

### Optimal Workers Configuration

Based on your machine:

| Machine Spec | Recommended Workers | Command |
|--------------|---------------------|---------|
| 4GB RAM, 2 cores | 2 workers | `WORKERS=2 npm run test:all` |
| 8GB RAM, 4 cores | 4 workers | `npm run test:parallel` (default) |
| 16GB+ RAM, 8+ cores | 8 workers | `npm run test:parallel:max` |

### Custom Workers

You can set any number of workers:

```bash
# Linux/Mac
WORKERS=6 npm run test:all

# Windows (PowerShell)
$env:WORKERS=6; npm run test:all

# Windows (CMD)
set WORKERS=6 && npm run test:all
```

## Test Execution Flow

### JobApplication.spec.js (Parallel Mode)

For each user in dataset.json:

**LinkedIn Suite:**
1. Login to LinkedIn
2. Apply jobs from search
3. Apply jobs from recommended
4. Apply jobs from notifications
5. Sign out

**Naukri Suite (runs parallel to LinkedIn):**
1. Login to Naukri
2. Update profile
3. Apply recommended jobs
4. Apply jobs from search

## Monitoring Execution

### Real-time Console Output

```
Running 14 tests using 4 workers

✓ LinkedIn - Muttu - LinkedIn Login and Search Jobs (45s)
✓ Naukri - Muttu - Naukri Login and Update (30s)
✓ LinkedIn - Bindu - LinkedIn Login and Search Jobs (43s)
✓ Naukri - Bindu - Naukri Login and Update (28s)
...
```

### HTML Report

After execution completes:

```bash
npm run report
```

This opens an interactive HTML report showing:
- Which tests passed/failed
- Screenshots of failures
- Videos of test execution
- Detailed trace logs

## Troubleshooting Parallel Execution

### Issue: Tests interfering with each other

**Solution:** Each test gets its own browser context, so they shouldn't interfere. If they do:
- Reduce workers: `WORKERS=2 npm run test:all`
- Check if dataset.json has duplicate credentials

### Issue: Out of memory errors

**Solution:** 
- Reduce workers
- Close other applications
- Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run test:parallel
```

### Issue: Want to see what's happening

**Solution:** Use headed mode:
```bash
npm run test:headed:all
```

### Issue: One user's test failing

**Solution:** Test individual user:
1. Edit dataset.json - keep only that user
2. Run in headed mode: `npm run test:headed:all`
3. Watch the browser to see what's happening

## Best Practices

### 1. Start Small
```bash
# First time? Start with 1 user in headed mode
npm run test:headed:all
```

### 2. Verify Credentials
Before parallel execution, verify all users in dataset.json have:
- ✓ Correct email/password
- ✓ Different accounts (no duplicates)
- ✓ Active accounts (not locked)

### 3. Monitor First Run
Watch the console output during first run:
```
LinkedIn - Muttu: Applied to 15 jobs
Naukri - Muttu: Applied to 8 jobs
LinkedIn - Bindu: Applied to 12 jobs
Naukri - Bindu: Applied to 10 jobs
```

### 4. Check Results
After execution:
```bash
npm run report
```

## Advanced Configuration

### Run Specific Users

Create separate files for different user groups:

**dataset-team1.json**
```json
{
  "datasets": [
    { "name": "Muttu", "data": {...} },
    { "name": "Bindu", "data": {...} }
  ]
}
```

**dataset-team2.json**
```json
{
  "datasets": [
    { "name": "Raju", "data": {...} },
    { "name": "Pavan", "data": {...} }
  ]
}
```

Modify test to load specific file.

### Timeout Configuration

Increase timeout for slow networks:

Edit `playwright.config.js`:
```javascript
timeout: 600000, // 10 minutes per test
```

## Expected Execution Time

| Users | Workers | Approx Time | Total Jobs Applied |
|-------|---------|-------------|-------------------|
| 1 | 2 | 15-20 min | ~50 jobs |
| 2 | 4 | 20-25 min | ~100 jobs |
| 3 | 4 | 25-30 min | ~150 jobs |
| 5 | 8 | 30-35 min | ~250 jobs |

*Time varies based on number of available jobs and network speed

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run test:parallel` | **Recommended**: LinkedIn + Naukri parallel (4 workers) |
| `npm run test:parallel:max` | Maximum parallelism (8 workers) |
| `npm run test:headed:all` | See browsers in action (2 workers) |
| `npm run test:linkedin` | LinkedIn only |
| `npm run test:naukri` | Naukri only |
| `npm run report` | View test results |

## Summary

✅ **For Production Use:** `npm run test:parallel`
✅ **For Debugging:** `npm run test:headed:all`
✅ **For Single Platform:** `npm run test:linkedin` or `npm run test:naukri`

The parallel execution mode runs LinkedIn and Naukri simultaneously for maximum efficiency!
