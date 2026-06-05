// Types
import type { DashboardOverviewApi } from "../types";

type GetDashboardOverviewParams = {
  month?: number;
  year?: number;
};

export const getDashboardOverviewServer = async (
  params?: GetDashboardOverviewParams
): Promise<DashboardOverviewApi> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const query = new URLSearchParams();

  if (params?.month) query.set("month", String(params.month));
  if (params?.year) query.set("year", String(params.year));

  const url = `${baseUrl}dashboard/overview${query.toString() ? `?${query.toString()}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard overview from server.");
  }

  return (await response.json()) as DashboardOverviewApi;
};
