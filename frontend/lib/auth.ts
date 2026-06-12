'use server';

import { cookies } from "next/headers";

type ProblemDetailsPayload = {
  detail?: string;
};

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

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const problemDetails = (await response
      .clone()
      .json()
      .catch(() => null)) as ProblemDetailsPayload | null;

    const detailMessage =
      problemDetails?.detail ??
      `Request failed with status ${response.status}.`;

    throw new Error(detailMessage);
  }

  return response;
};
