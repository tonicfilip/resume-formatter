import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

const SAMPLE_CONTACT = {
  name:     'Filip Tonic',
  email:    'filip@example.com',
  phone:    '+381644454945',
  location: 'Niš, Serbia',
  linkedin: 'https://linkedin.com/in/filip-tonic',
  github:   'https://github.com/tonicfilip',
}

test.describe('Resume Formatter', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/resume`)
  })

  // ─── Landing ───────────────────────────────────────────────────

  test('landing page loads and CTA navigates to /resume', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('h1')).toContainText('resume')
    await page.click('a[href="/resume"]')
    await expect(page).toHaveURL(`${BASE}/resume`)
  })

  // ─── Form ──────────────────────────────────────────────────────

  test('fills contact fields', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]',     SAMPLE_CONTACT.name)
    await page.fill('[data-testid="contact-email"]',    SAMPLE_CONTACT.email)
    await page.fill('[data-testid="contact-phone"]',    SAMPLE_CONTACT.phone)
    await page.fill('[data-testid="contact-location"]', SAMPLE_CONTACT.location)
    await page.fill('[data-testid="contact-linkedin"]', SAMPLE_CONTACT.linkedin)
    await page.fill('[data-testid="contact-github"]',   SAMPLE_CONTACT.github)

    await expect(page.locator('[data-testid="contact-name"]')).toHaveValue(SAMPLE_CONTACT.name)
    await expect(page.locator('[data-testid="contact-email"]')).toHaveValue(SAMPLE_CONTACT.email)
  })

  test('preview iframe appears after typing name', async ({ page }) => {
    await expect(page.locator('[data-testid="preview-iframe"]')).not.toBeVisible()
    await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
    await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })
  })

  test('preview updates when template is switched', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
    await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })

    const getPreviewContent = () =>
      page.locator('[data-testid="preview-iframe"]').contentFrame().locator('body').innerHTML()

    await page.click('button:has-text("Classic")')
    await page.waitForTimeout(600)
    const classicHtml = await getPreviewContent()

    await page.click('button:has-text("Minimal")')
    await page.waitForTimeout(600)
    const minimalHtml = await getPreviewContent()

    expect(classicHtml).not.toEqual(minimalHtml)
  })

  test('adds and removes an experience entry', async ({ page }) => {
    await page.click('button:has-text("+ Add role")')

    const card = page.locator('.card-wrap').first()
    await expect(card).toBeVisible()

    await card.locator('input[placeholder="Company"]').fill('The Idea Compiler')
    await card.locator('input[placeholder="Role / Title"]').fill('Senior Engineer')
    await expect(card.locator('input[placeholder="Company"]')).toHaveValue('The Idea Compiler')

    await card.hover()
    await card.locator('.remove-btn').click()
    await expect(page.locator('.card-wrap')).toHaveCount(0)
  })

  test('adds a skill group', async ({ page }) => {
    await page.click('button:has-text("+ Add group")')
    const card = page.locator('.card-wrap').first()
    await card.locator('input[placeholder*="Category"]').fill('Languages')
    await card.locator('input[placeholder*="comma"]').fill('Python, Go, TypeScript')
    await expect(card.locator('input[placeholder*="Category"]')).toHaveValue('Languages')
  })

  // ─── Preview content ───────────────────────────────────────────

  test('preview iframe contains entered name and email', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
    await page.fill('[data-testid="contact-email"]', 'filip@example.com')
    await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible({ timeout: 3000 })

    const frame = page.locator('[data-testid="preview-iframe"]').contentFrame()
    await expect(frame.locator('body')).toContainText('Filip Tonic')
    await expect(frame.locator('body')).toContainText('filip@example.com')
  })

  test('preview contains experience after adding it', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
    await page.click('button:has-text("+ Add role")')

    const card = page.locator('.card-wrap').first()
    await card.locator('input[placeholder="Company"]').fill('The Idea Compiler')
    await card.locator('input[placeholder="Role / Title"]').fill('Senior Engineer')
    await page.waitForTimeout(600)

    const frame = page.locator('[data-testid="preview-iframe"]').contentFrame()
    await expect(frame.locator('body')).toContainText('The Idea Compiler', { timeout: 3000 })
  })

  // ─── Auth / download gate ──────────────────────────────────────

  test('download button is visible in header', async ({ page }) => {
    await expect(page.locator('[data-testid="download-btn"]')).toBeVisible()
  })

  test('download button prompts sign-in when not authenticated', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Filip Tonic')
    await page.click('[data-testid="download-btn"]')
    await expect(page.locator('text=Sign in')).toBeVisible({ timeout: 2000 })
  })

})
