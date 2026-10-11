# Quick Start Guide

Get started with automated job applications in 5 minutes!

## Step 1: Install Dependencies

```bash
cd c:\Projects\PracticeJavascript
npm install
npx playwright install chromium
```

## Step 2: Configure Your Data

Edit `dataset.json` with your credentials:

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
        ...
      }
    }
  ]
}
```

## Step 3: Test with One User First

**Keep only ONE user in dataset.json, then run:**

```bash
npm run test:headed:all
```

This will open browsers so you can watch the automation!

## Step 4: Run in Parallel (Production)

Once verified, add all your users to dataset.json and run:

```bash
npm run test:parallel
```

This runs LinkedIn and Naukri simultaneously for each user!

## Step 5: View Results

```bash
npm run report
```

## Common Commands

| What | Command |
|------|---------|
| **Run all (parallel)** | `npm run test:parallel` |
| **See browsers** | `npm run test:headed:all` |
| **LinkedIn only** | `npm run test:linkedin` |
| **Naukri only** | `npm run test:naukri` |
| **View report** | `npm run report` |

## Example Output

```
Running 6 tests using 4 workers

✓ LinkedIn - Muttu - Login and Search Jobs (45s)
  Applied to 15 jobs on LinkedIn
  
✓ Naukri - Muttu - Login and Update (30s)
  Applied to 8 jobs on Naukri
  
✓ LinkedIn - Bindu - Login and Search Jobs (43s)
  Applied to 12 jobs on LinkedIn
  
✓ Naukri - Bindu - Login and Update (28s)
  Applied to 10 jobs on Naukri

6 passed (2.5m)
```

## Troubleshooting

**Issue:** Can't login / CAPTCHA appearing
- **Solution:** Run `npm run test:headed` to see and solve CAPTCHA manually

**Issue:** No jobs found
- **Solution:** Adjust job search criteria in dataset.json

**Issue:** Application limit reached
- **Solution:** Normal! LinkedIn/Naukri have daily limits (~100-200 jobs)

## Need Help?

See detailed guides:
- `EXECUTION_GUIDE.md` - All execution modes explained
- `README.md` - Complete documentation

---

**You're all set! Happy job hunting! 🚀**
