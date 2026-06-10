"use server";

import { revalidateTag } from "next/cache";

import { getServerUserId } from "@/lib/auth";

export async function invalidateTransactionsCache() {
  const userId = await getServerUserId();
  revalidateTag(`transactions-${userId}`, "default");
  revalidateTag(`dashboard-overview-${userId}`, "default");
}
