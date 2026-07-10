// libs
import { api } from "@/lib/axios";

import { authFetch, getServerUserId } from "@/lib/auth";

import { getServerApiBaseUrl } from "@/lib/server-api";

// types
import type { MonthlyReportApi } from "../types";

type MonthlyReportParams = {
  month: number;
  year: number;
};

export const getMonthlyReportServer = async (
  params: MonthlyReportParams,
): Promise<MonthlyReportApi> => {
  const baseUrl = getServerApiBaseUrl();

  const userId = await getServerUserId();

  const url = new URL("reports/monthly", baseUrl);

  url.search = new URLSearchParams({
    month: String(params.month),
    year: String(params.year),
  }).toString();

  const response = await authFetch(url.toString(), {
    next: { tags: [`reports-monthly-${userId}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch monthly report from server.");
  }

  return (await response.json()) as MonthlyReportApi;
};

export const getMonthlyReport = async (
  params: MonthlyReportParams,
): Promise<MonthlyReportApi> => {
  const response = await api.get<MonthlyReportApi>("/reports/monthly", {
    params,
  });

  return response.data;
};

export const downloadMonthlyReportExcel = async (
  params: MonthlyReportParams,
): Promise<void> => {
  const response = await api.get("/reports/monthly/excel", {
    params,
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `SmartBudget-${params.month}-${params.year}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
