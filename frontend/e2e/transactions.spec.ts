import { test, expect } from "@playwright/test";

import { loginHelper } from "./helpers/login-helper";

async function fillTransactionDate(page: import("@playwright/test").Page) {
  const today = new Date().getDate().toString();

  await page.getByRole("button", { name: "Selecione uma data" }).click();
  await page.getByRole("gridcell").filter({ hasText: new RegExp(`^${today}$`) }).first().getByRole("button").click();
}

test.describe("Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await loginHelper(page);
    await page.goto("/transactions");
  });

  test("criar transação de receita exibe na lista", async ({ page }) => {
    const description = `E2E Receita ${Date.now()}`;

    await page.getByRole("button", { name: "Adicionar nova Transação" }).click();

    await expect(page.getByText("Adicionar nova transação")).toBeVisible();

    await page.getByLabel("Valor").fill("150");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Receita" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });
  });

  test("criar transação de despesa com categoria exibe na lista e vincula categoria", async ({ page }) => {
    const categoryName = `E2E Cat ${Date.now()}`;
    const description = `E2E Despesa ${Date.now()}`;

    await page.goto("/categories");
    await page.getByRole("button", { name: "Criar nova categoria" }).click();
    await page.getByLabel("Nome").fill(categoryName);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText(categoryName)).toBeVisible({ timeout: 8000 });

    await page.goto("/transactions");
    await page.getByRole("button", { name: "Adicionar nova Transação" }).click();

    await expect(page.getByText("Adicionar nova transação")).toBeVisible();

    await page.getByLabel("Valor").fill("80");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Despesa" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByLabel("Categoria").fill(categoryName);
    await page.getByRole("button", { name: categoryName }).first().click();

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(categoryName).first()).toBeVisible();
  });
});
