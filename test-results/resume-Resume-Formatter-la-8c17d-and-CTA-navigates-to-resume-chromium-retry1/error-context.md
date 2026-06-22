# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resume.spec.ts >> Resume Formatter >> landing page loads and CTA navigates to /resume
- Location: e2e/resume.spec.ts:22:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/resume"
Received: "https://topical-rattler-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    5 × unexpected value "http://localhost:3000/"
    - waiting for" https://topical-rattler-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume&__clerk_db_jwt=dvb_3FPTEKng0SB5jjwfDu7mPKtp743" navigation to finish...
    - navigated to "https://topical-rattler-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume&__clerk_db_jwt=dvb_3FPTEKng0SB5jjwfDu7mPKtp743"
    - unexpected value "https://topical-rattler-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume&__clerk_db_jwt=dvb_3FPTEKng0SB5jjwfDu7mPKtp743"
    7 × unexpected value "https://topical-rattler-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume"

```

```yaml
- heading "Sign in to resume-formatter" [level=1]
- paragraph: Welcome back! Please sign in to continue
- button "Sign in with Google Continue with Google": Continue with Google
- paragraph: or
- text: Email address
- textbox "Email address":
  - /placeholder: Enter your email address
- button "Continue":
  - text: Continue
  - img
- text: Don’t have an account?
- link "Sign up":
  - /url: https://topical-rattler-54.accounts.dev/sign-up#/?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fresume
- paragraph: Secured by
- link "Clerk logo":
  - /url: https://go.clerk.com/components
  - img
- paragraph: Development mode
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const BASE = 'http://localhost:3000'
  4   | 
  5   | const SAMPLE_CONTACT = {
  6   |   name:     'Filip Tonic',
  7   |   email:    'filip@example.com',
  8   |   phone:    '+381644454945',
  9   |   location: 'Niš, Serbia',
  10  |   linkedin: 'https://linkedin.com/in/filip-tonic',
  11  |   github:   'https://github.com/tonicfilip',
  12  | }
  13  | 
  14  | test.describe('Resume Formatter', () => {
  15  | 
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await page.goto(`${BASE}/resume`)
  18  |   })
  19  | 
  20  |   // ─── Landing ───────────────────────────────────────────────────
  21  | 
  22  |   test('landing page loads and CTA navigates to /resume', async ({ page }) => {
  23  |     await page.goto(BASE)
  24  |     await expect(page.locator('h1')).toContainText('resume')
  25  |     await page.click('a[href="/resume"]')
> 26  |     await expect(page).toHaveURL(`${BASE}/resume`)
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  27  |   })
  28  | 
  29  |   // ─── Form ──────────────────────────────────────────────────────
  30  | 
  31  |   test('fills contact fields', async ({ page }) => {
  32  |     await page.fill('[data-testid="contact-name"]',     SAMPLE_CONTACT.name)
  33  |     await page.fill('[data-testid="contact-email"]',    SAMPLE_CONTACT.email)
  34  |     await page.fill('[data-testid="contact-phone"]',    SAMPLE_CONTACT.phone)
  35  |     await page.fill('[data-testid="contact-location"]', SAMPLE_CONTACT.location)
  36  |     await page.fill('[data-testid="contact-linkedin"]', SAMPLE_CONTACT.linkedin)
  37  |     await page.fill('[data-testid="contact-github"]',   SAMPLE_CONTACT.github)
  38  | 
  39  |     await expect(page.locator('[data-testid="contact-name"]')).toHaveValue(SAMPLE_CONTACT.name)
  40  |     await expect(page.locator('[data-testid="contact-email"]')).toHaveValue(SAMPLE_CONTACT.email)
  41  |   })
  42  | 
  43  |   test('preview iframe appears after typing name', async ({ page }) => {
  44  |     await expect(page.locator('[data-testid="preview-iframe"]')).not.toBeVisible()
  45  |     await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
  46  |     await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })
  47  |   })
  48  | 
  49  |   test('preview updates when template is switched', async ({ page }) => {
  50  |     await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
  51  |     await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })
  52  | 
  53  |     const getPreviewContent = () =>
  54  |       page.locator('[data-testid="preview-iframe"]').contentFrame().locator('body').innerHTML()
  55  | 
  56  |     await page.click('button:has-text("Classic")')
  57  |     await page.waitForTimeout(600)
  58  |     const classicHtml = await getPreviewContent()
  59  | 
  60  |     await page.click('button:has-text("Minimal")')
  61  |     await page.waitForTimeout(600)
  62  |     const minimalHtml = await getPreviewContent()
  63  | 
  64  |     expect(classicHtml).not.toEqual(minimalHtml)
  65  |   })
  66  | 
  67  |   test('adds and removes an experience entry', async ({ page }) => {
  68  |     await page.click('button:has-text("+ Add role")')
  69  | 
  70  |     const card = page.locator('.card-wrap').first()
  71  |     await expect(card).toBeVisible()
  72  | 
  73  |     await card.locator('input[placeholder="Company"]').fill('The Idea Compiler')
  74  |     await card.locator('input[placeholder="Role / Title"]').fill('Senior Engineer')
  75  |     await expect(card.locator('input[placeholder="Company"]')).toHaveValue('The Idea Compiler')
  76  | 
  77  |     await card.hover()
  78  |     await card.locator('.remove-btn').click()
  79  |     await expect(page.locator('.card-wrap')).toHaveCount(0)
  80  |   })
  81  | 
  82  |   test('adds a skill group', async ({ page }) => {
  83  |     await page.click('button:has-text("+ Add group")')
  84  |     const card = page.locator('.card-wrap').first()
  85  |     await card.locator('input[placeholder*="Category"]').fill('Languages')
  86  |     await card.locator('input[placeholder*="comma"]').fill('Python, Go, TypeScript')
  87  |     await expect(card.locator('input[placeholder*="Category"]')).toHaveValue('Languages')
  88  |   })
  89  | 
  90  |   // ─── Preview content ───────────────────────────────────────────
  91  | 
  92  |   test('preview iframe contains entered name and email', async ({ page }) => {
  93  |     await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
  94  |     await page.fill('[data-testid="contact-email"]', 'filip@example.com')
  95  |     await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })
  96  | 
  97  |     const frame = page.locator('[data-testid="preview-iframe"]').contentFrame()
  98  |     await expect(frame.locator('body')).toContainText('Filip Tonic')
  99  |     await expect(frame.locator('body')).toContainText('filip@example.com')
  100 |   })
  101 | 
  102 |   test('preview contains experience after adding it', async ({ page }) => {
  103 |     await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
  104 |     await page.click('button:has-text("+ Add role")')
  105 | 
  106 |     const card = page.locator('.card-wrap').first()
  107 |     await card.locator('input[placeholder="Company"]').fill('The Idea Compiler')
  108 |     await card.locator('input[placeholder="Role / Title"]').fill('Senior Engineer')
  109 |     await page.waitForTimeout(600)
  110 | 
  111 |     const frame = page.locator('[data-testid="preview-iframe"]').contentFrame()
  112 |     await expect(frame.locator('body')).toContainText('The Idea Compiler', { timeout: 3000 })
  113 |   })
  114 | 
  115 |   // ─── Auth / download gate ──────────────────────────────────────
  116 | 
  117 |   test('download button is visible in header', async ({ page }) => {
  118 |     await expect(page.locator('[data-testid="download-btn"]')).toBeVisible()
  119 |   })
  120 | 
  121 |   test('download button prompts sign-in when not authenticated', async ({ page }) => {
  122 |     await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
  123 |     await page.click('[data-testid="download-btn"]')
  124 |     await expect(page.locator('text=Sign in')).toBeVisible({ timeout: 2000 })
  125 |   })
  126 | 
```