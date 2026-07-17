"use server";

import { revalidateTag } from "next/cache";

import { authFetch, getServerUserId } from "@/lib/auth";

import { getServerApiBaseUrl } from "@/lib/server-api";

import type { DashboardConfigItem } from "../types";

type ActionResult = { success: true } | { success: false; error: string };

export async function saveDashboardConfigAction(
  items: DashboardConfigItem[],
): Promise<ActionResult> {
  try {
    const baseUrl = getServerApiBaseUrl();

    await authFetch(`${baseUrl}dashboard/config`, {
      method: "PUT",
      body: JSON.stringify(items),
    });

    const userId = await getServerUserId();

    revalidateTag(`dashboard-config-${userId}`, "default");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save dashboard config.";

    return { success: false, error: message };
  }
}
