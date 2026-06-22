import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,   // run sequentially — easier to debug locally
  retries: 1,
  timeout: 15_000,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,        // change to false to watch the browser fill the form
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Start the dev server automatically before tests run
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,   // if you already have `npm run dev` running, it won't start a second one
    timeout: 30_000,
  },
})
