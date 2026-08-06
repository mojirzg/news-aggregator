import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const crossBrowserSmoke = /cross-browser-smoke\.spec\.ts/;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',

  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      testIgnore: crossBrowserSmoke,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testIgnore: crossBrowserSmoke,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop-firefox',
      testMatch: crossBrowserSmoke,
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'pnpm build && pnpm start',
    url: `http://127.0.0.1:${port}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEWS_PROVIDER_MODE: 'mock',
      NODE_ENV: 'test',
      PORT: String(port),
    },
  },
});
