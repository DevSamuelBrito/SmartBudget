// next-intl
import type { useTranslations } from "next-intl";

// Types
import type { DashboardAlertType } from "../types";

type TranslateFn = ReturnType<typeof useTranslations<"dashboard">>;

export function getAlertMessage(
  t: TranslateFn,
  type: DashboardAlertType,
  categoryName: string,
  percentage: number
): string {
  if (type === "BudgetExceeded") {
    return t("alerts.budgetExceeded", { categoryName });
  }

  return t("alerts.budgetWarning", {
    categoryName,
    percentage: percentage.toFixed(0),
  });
}
