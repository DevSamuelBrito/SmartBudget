export type CategoryApi = {
  id: string;
  userId: string;
  name: string;
  icon: ThemeIconKey;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  themeId: string;
};

import type { ThemeIconKey } from "../components/theme-icons";

export type { ThemeIconKey };

export type CategoryTheme = {
  id: string;
  label: string;
  colorClass: string;
  iconKey: ThemeIconKey;
};

export type BudgetByPeriodStatus = "Ok" | "Warning" | "Exceeded" | 1 | 2 | 3;

export type BudgetByPeriodApi = {
  id: string;
  transactionCategoryId: string;
  categoryName: string;
  categoryIcon: string;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
  status: BudgetByPeriodStatus;
};

export type { CategoryFormValues } from "../schemas/category.schema";
