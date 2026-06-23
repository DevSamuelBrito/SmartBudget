import { api } from "@/lib/axios";

import { authFetch, getServerUserId } from "@/lib/auth";

import { getServerApiBaseUrl } from "@/lib/server-api";

import type { BudgetByPeriodApi, BudgetByPeriodStatus } from "../types";

type GetBudgetsByPeriodParams = {
  month: number;
  year: number;
};

type CreateBudgetRequest = {
  userId: string;
  transactionCategoryId: string;
  month: number;
  year: number;
  limitAmount: number;
};

type UpdateBudgetRequest = {
  id: string;
  limitAmount: number;
};

function normalizeStatus(status: BudgetByPeriodStatus): BudgetByPeriodStatus {
  if (status === 1) {
    return "Ok";
  }

  if (status === 2) {
    return "Warning";
  }

  if (status === 3) {
    return "Exceeded";
  }

  return status;
}

function normalizeBudgetStatus(budget: BudgetByPeriodApi): BudgetByPeriodApi {
  return {
    ...budget,
    status: normalizeStatus(budget.status),
  };
}

export const getBudgetsByPeriod = async ({
  month,
  year,
}: GetBudgetsByPeriodParams) => {
  const response = await api.get<BudgetByPeriodApi[]>("/budgets/by-period", {
    params: {
      month,
      year,
    },
  });

  return response.data.map(normalizeBudgetStatus);
};

export const getBudgetsByPeriodServerCached = async ({
  month,
  year,
}: GetBudgetsByPeriodParams) => {
  const baseUrl = getServerApiBaseUrl();

  const query = new URLSearchParams({
    month: String(month),
    year: String(year),
  });

  const userId = await getServerUserId();

  const response = await authFetch(
    `${baseUrl}budgets/by-period?${query.toString()}`,
    {
      next: { tags: [`budgets-${userId}`] },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch budgets from server.");
  }

  const budgets = (await response.json()) as BudgetByPeriodApi[];

  return budgets.map(normalizeBudgetStatus);
};

export const createBudget = async (payload: CreateBudgetRequest) => {
  const response = await api.post("/budgets", payload);

  return response.data;
};

export const updateBudget = async ({
  id,
  limitAmount,
}: UpdateBudgetRequest) => {
  await api.put(`/budgets/${id}`, {
    limitAmount,
  });
};
