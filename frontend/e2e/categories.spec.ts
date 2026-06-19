import { test, expect } from "@playwright/test";

import { loginHelper } from "./helpers/login-helper";

test.describe("Categories", () => {
  test.beforeEach(async ({ page }) => {
    await loginHelper(page);
    await page.goto("/categories");
  });

  test("criar categoria exibe a categoria na tabela", async ({ page }) => {
    const categoryName = `E2E Categoria ${Date.now()}`;

    await page.getByRole("button", { name: "Criar nova categoria" }).click();

    await expect(page.getByText("Criar categoria")).toBeVisible();

    await page.getByLabel("Nome").fill(categoryName);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(categoryName)).toBeVisible({ timeout: 8000 });
  });

  test("editar categoria atualiza o nome na tabela", async ({ page }) => {
    const originalName = `E2E Edit ${Date.now()}`;
    const updatedName = `${originalName} Editado`;

    await page.getByRole("button", { name: "Criar nova categoria" }).click();
    await page.getByLabel("Nome").fill(originalName);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText(originalName)).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: `Editar ${originalName}` }).click();

    await expect(page.getByText("Renomear categoria")).toBeVisible();

    await page.getByLabel("Nome").clear();
    await page.getByLabel("Nome").fill(updatedName);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(updatedName)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(originalName)).not.toBeVisible();
  });

  test("excluir categoria remove a linha da tabela", async ({ page }) => {
    const categoryName = `E2E Delete ${Date.now()}`;

    await page.getByRole("button", { name: "Criar nova categoria" }).click();
    await page.getByLabel("Nome").fill(categoryName);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText(categoryName)).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: `Excluir ${categoryName}` }).click();

    await expect(page.getByText("Excluir categoria")).toBeVisible();

    await page.getByRole("button", { name: "Excluir" }).click();

    await expect(page.getByText(categoryName)).not.toBeVisible({ timeout: 8000 });
  });
});
