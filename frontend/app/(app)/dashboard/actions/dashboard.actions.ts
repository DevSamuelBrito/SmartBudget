"use server";

import { revalidatePath } from "next/cache";

import type { DashboardConfigItem } from "../types";

export async function saveDashboardConfigAction(items: DashboardConfigItem[]) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  const response = await fetch(`${baseUrl}dashboard/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });

  if (!response.ok) {
    throw new Error("Failed to save dashboard config.");
  }

  revalidatePath("/dashboard");
}
