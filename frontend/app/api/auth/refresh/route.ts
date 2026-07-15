//next
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

// jose
import { decodeJwt } from "jose";

//libs
import { getCookieBase } from "@/lib/cookie-config";

interface RefreshApiResponse {
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
}

const COOKIE_BASE = getCookieBase();

const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

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

  const result = await doRefresh(refreshToken);

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

  const existingUserDataStr = cookieStore.get("user-data")?.value;

  if (existingUserDataStr) {
    try {
      const existing = JSON.parse(existingUserDataStr) as Record<string, unknown>;

      const payload = decodeJwt(result.accessToken);

      const updatedUserData = {
        ...existing,
        name: typeof payload["name"] === "string" ? payload["name"] : existing.name,
        email: typeof payload["email"] === "string" ? payload["email"] : existing.email,
        isPremium: payload["isPremium"] === "true",
      };
      
      response.cookies.set("user-data", JSON.stringify(updatedUserData), {
        ...getCookieBase({ httpOnly: false }),
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
      });
    } catch {
      
    }
  }

  return response;
}
