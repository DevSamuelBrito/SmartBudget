import { test, expect, type Page } from "@playwright/test";

import { loginHelper } from "./helpers/login-helper";

import { createCategoryHelper } from "./helpers/category-helper";

async function fillTransactionDate(page: Page) {
  const today = new Date().getDate().toString();

  await page.getByRole("button", { name: "Selecione uma data" }).click();
  await page
    .getByRole("gridcell")
    .filter({ hasText: new RegExp(`^${today}$`) })
    .first()
    .getByRole("button")
    .click();
}

test.describe("Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await loginHelper(page);
    await page.goto("/transactions");
  });

  test("criar transação de receita exibe na lista", async ({ page }) => {
    const description = `E2E Receita ${Date.now()}`;

    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();

    await page.getByLabel("Valor").fill("150");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Receita" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });
  });

  test("criar transação de despesa com categoria exibe na lista e vincula categoria", async ({
    page,
  }) => {
    const categoryName = await createCategoryHelper(page);
    const description = `E2E Despesa ${Date.now()}`;

    await page.goto("/transactions");
    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();

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

  test("criar transação de receita sem categoria → deve aparecer na lista", async ({
    page,
  }) => {
    const description = `E2E Receita Sem Cat ${Date.now()}`;

    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();

    await page.getByLabel("Valor").fill("200");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Receita" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });
  });

  test("criar transação de despesa sem categoria → deve exibir erro de validação", async ({
    page,
  }) => {
    const description = `E2E Despesa Sem Cat ${Date.now()}`;

    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();

    await page.getByLabel("Valor").fill("50");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Despesa" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByRole("listitem").first()).toContainText(
      "Category is required for expense transactions.",
    );

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();
  });

  test("editar transação → deve atualizar na lista", async ({ page }) => {
    const ts = Date.now();
    const description = `E2E Edit ${ts}`;
    const updatedDescription = `E2E Edit Atualizada ${ts}`;

    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();
    await page.getByLabel("Valor").fill("100");
    await fillTransactionDate(page);
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Receita" }).click();
    await page.getByLabel("Descrição").fill(description);
    await page.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: `Editar ${description}` }).click();
    await expect(page.getByText("Editar transação")).toBeVisible();

    await page.getByLabel("Descrição").clear();
    await page.getByLabel("Descrição").fill(updatedDescription);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(updatedDescription)).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByText(description)).not.toBeVisible();
  });

  test("excluir transação → deve remover da lista", async ({ page }) => {
    const description = `E2E Delete ${Date.now()}`;

    await page
      .getByRole("button", { name: "Adicionar nova Transação" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Adicionar nova transação",
      }),
    ).toBeVisible();

    await page.getByLabel("Valor").fill("75");

    await fillTransactionDate(page);

    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Receita" }).click();

    await page.getByLabel("Descrição").fill(description);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText(description)).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: `Excluir ${description}` }).click();

    await expect(page.getByText("Excluir transação")).toBeVisible();

    await page.getByRole("button", { name: "Excluir" }).click();

    await expect(page.getByText("Excluir transação")).not.toBeVisible();

    await expect(page.getByRole("cell", { name: description })).toHaveCount(0);
  });
  
});
