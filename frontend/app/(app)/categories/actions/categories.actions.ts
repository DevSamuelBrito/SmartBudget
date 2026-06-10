"use server";

import { revalidateTag } from "next/cache";

import { getServerUserId } from "@/lib/auth";

export async function invalidateCategoriesCache() {
  const userId = await getServerUserId();
  revalidateTag(`categories-${userId}`, "default");
  revalidateTag(`dashboard-overview-${userId}`, "default");
}

export async function invalidateBudgetsCache(_period?: {
  month: number;
  year: number;
}) {
  const userId = await getServerUserId();
  revalidateTag(`budgets-${userId}`, "default");
  revalidateTag(`dashboard-overview-${userId}`, "default");
}
