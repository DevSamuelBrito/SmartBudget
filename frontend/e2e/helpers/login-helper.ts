import type { Page } from "@playwright/test";

export const TEST_EMAIL = process.env.E2E_EMAIL ?? "test@example.com";
export const TEST_PASSWORD = process.env.E2E_PASSWORD ?? "Test@123";

export async function loginHelper(page: Page): Promise<void> {
  await page.goto("/login");

  const loginForm = page.locator("form").first();

  await loginForm.locator("#email").fill(TEST_EMAIL);
  await loginForm.locator("#password").fill(TEST_PASSWORD);

  await loginForm.locator('button[type="submit"]').click();

  await page.waitForURL("**/dashboard");
}