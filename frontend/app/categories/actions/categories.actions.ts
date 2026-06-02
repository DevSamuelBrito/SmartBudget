"use server";

import { revalidatePath } from "next/cache";

export async function invalidateCategoriesCache() {
  revalidatePath("categories");
}

export async function invalidateBudgetsCache(period?: { month: number; year: number }) {
  revalidatePath("budgets");

  if (period) {
    revalidatePath(`budgets-${period.year}-${period.month}`);
  }
}