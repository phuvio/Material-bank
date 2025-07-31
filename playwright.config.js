import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2eTests',
  timeout: 30_000,
  fullyParallel: false,
  retries: 1,
  globalSetup: './e2eTests/global-setup.js',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  webServer: [
    {
      command: 'npm run dev:backend:test',
      port: 3001,
      timeout: 60 * 1000,
      reuseExistingServer: true,
      },
    {
      command: 'npm run dev:test',
      port: 5173,
      timeout: 120 * 1000,
      // eslint-disable-next-line no-undef
      reuseExistingServer: !process.env.CI,
    },
],
  reporter: [['html', { open: 'never' }]],
})
