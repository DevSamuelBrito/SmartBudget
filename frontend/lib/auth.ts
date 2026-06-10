'use server';

import { cookies } from "next/headers";

export const getServerUserId = async (): Promise<string> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("user-data")?.value;

  if (!raw) {
    throw new Error("user-data cookie not found.");
  }

  const parsed = JSON.parse(decodeURIComponent(raw)) as { userId?: string };

  if (!parsed.userId) {
    throw new Error("userId not found in user-data cookie.");
  }

  return parsed.userId;
};

export const authFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
};
