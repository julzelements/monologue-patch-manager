import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    // Default baseURL for app e2e tests; Storybook tests
    // can still call page.goto with an absolute URL or
    // override baseURL if needed.
    baseURL: "http://localhost:5173",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
