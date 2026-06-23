"use server";

//next
import { cookies } from "next/headers";

//jose
import { decodeJwt } from "jose";

type ProblemDetailsPayload = {
  detail?: string;
};

export const getServerUserId = async (): Promise<string> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token not found.");
  }

  const payload = decodeJwt(token);
  const userId = payload.sub;

  if (!userId) {
    throw new Error("userId not found in token.");
  }

  return userId;
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
