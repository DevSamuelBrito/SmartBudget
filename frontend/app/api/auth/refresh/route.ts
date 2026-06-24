//next
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

interface RefreshApiResponse {
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
}

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

let refreshPromise: Promise<RefreshApiResponse | null> | null = null;

async function doRefresh(token: string): Promise<RefreshApiResponse | null> {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

    const base = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

    const res = await fetch(`${base}auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (!res.ok) return null;

    return (await res.json()) as RefreshApiResponse;
  } catch {
    return null;
  }
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  if (!refreshPromise) {
    refreshPromise = doRefresh(refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  const result = await refreshPromise;

  if (!result) {

    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", result.accessToken, {
    ...COOKIE_BASE,
    maxAge: result.expiresInSeconds,
  });

  response.cookies.set("refresh-token", result.refreshToken, {
    ...COOKIE_BASE,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}
