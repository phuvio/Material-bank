import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2eTests',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 120 * 1000,
    // eslint-disable-next-line no-undef
    reuseExistingServer: !process.env.CI,
  },
})
