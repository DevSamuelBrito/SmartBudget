import { test, expect } from "@playwright/test";

import { loginHelper, TEST_EMAIL, TEST_PASSWORD } from "./helpers/login-helper";

test.describe("Authentication", () => {
  test("login com credenciais válidas redireciona para /dashboard", async ({
    page,
  }) => {
    await loginHelper(page);

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("login com credenciais inválidas exibe mensagem de erro", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("E-mail").fill("invalid@example.com");
    await page.getByLabel("Senha").fill("WrongPassword123!");
    await page.getByTestId("login-submit-button").click();
    
    const errorToast = page
      .getByRole("status")
      .or(page.locator("[data-sonner-toast]"));
    await expect(errorToast.first()).toBeVisible({ timeout: 5000 });
  });

  test("logout redireciona para /login", async ({ page }) => {
    await loginHelper(page);

    await page.getByRole("button").filter({ hasText: TEST_EMAIL }).click();
    await page.getByRole("menuitem", { name: "Sair" }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("usuário logado que acessa /login é redirecionado para /dashboard", async ({
    page,
  }) => {
    await loginHelper(page);

    await page.goto("/login");

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
