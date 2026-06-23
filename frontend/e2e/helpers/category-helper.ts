import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function createCategoryHelper(
  page: Page,
  name?: string,
): Promise<string> {
  const categoryName = name ?? `E2E Cat ${Date.now()}`;

  await page.goto("/categories");
  await page.getByRole("button", { name: "Criar nova categoria" }).click();
  await page.getByLabel("Nome").fill(categoryName);
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByText(categoryName)).toBeVisible({ timeout: 8000 });

  return categoryName;
}
