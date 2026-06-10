"use server";

import { revalidateTag } from "next/cache";

import { authFetch, getServerUserId } from "@/lib/auth";

import type { DashboardConfigItem } from "../types";

export async function saveDashboardConfigAction(items: DashboardConfigItem[]) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const response = await authFetch(`${baseUrl}dashboard/config`, {
    method: "PUT",
    body: JSON.stringify(items),
  });

  if (!response.ok) {
    throw new Error("Failed to save dashboard config.");
  }

  const userId = await getServerUserId();
  revalidateTag(`dashboard-config-${userId}`, "default");
}
