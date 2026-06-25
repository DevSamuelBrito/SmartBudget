//next
import { type NextRequest, NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

// jose
import { decodeJwt } from "jose";

// lib
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

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

function isTokenExpiringSoon(token: string): boolean {
  try {
    const { exp } = decodeJwt(token);

    if (typeof exp !== "number") return true;

    return exp - Math.floor(Date.now() / 1000) < 60;
  } catch {
    return true;
  }
}

async function callRefreshApi(refreshToken: string): Promise<RefreshApiResponse | null> {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
    const base = apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`;

    const res = await fetch(`${base}auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    return (await res.json()) as RefreshApiResponse;
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;

  let newTokens: RefreshApiResponse | null = null;
  let refreshFailed = false;

  if ((!token || isTokenExpiringSoon(token)) && refreshToken) {
    newTokens = await callRefreshApi(refreshToken);
    if (!newTokens) refreshFailed = true;
  }

  if (refreshFailed) {
    const { pathname } = request.nextUrl;
    const isAuthRoute = /\/(login|register)(\/|$)/.test(pathname);

    if (!isAuthRoute) {
      const locale = pathname.split("/")[1] ?? "";
      const loginPath = locale ? `/${locale}/login` : "/login";
      const redirectRes = NextResponse.redirect(new URL(loginPath, request.url));

      redirectRes.cookies.delete("token");

      redirectRes.cookies.delete("refresh-token");

      redirectRes.cookies.delete("user-data");

      return redirectRes;
    }

    const response = intlMiddleware(request);

    response.cookies.delete("token");

    response.cookies.delete("refresh-token");

    response.cookies.delete("user-data");

    return response;
  }

  const response = intlMiddleware(request);

  if (newTokens) {
    response.cookies.set("token", newTokens.accessToken, {
      ...COOKIE_BASE,
      maxAge: newTokens.expiresInSeconds,
    });

    response.cookies.set("refresh-token", newTokens.refreshToken, {
      ...COOKIE_BASE,
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    const existingUserData = request.cookies.get("user-data")?.value;

    if (existingUserData) {

      try {
        const existing = JSON.parse(existingUserData) as Record<string, unknown>;
        
        const payload = decodeJwt(newTokens.accessToken);

        const updatedUserData = {
          ...existing,
          name: typeof payload["name"] === "string" ? payload["name"] : existing.name,
          email: typeof payload["email"] === "string" ? payload["email"] : existing.email,
          isPremium: payload["isPremium"] === "true",
        };

        response.cookies.set("user-data", JSON.stringify(updatedUserData), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
        });
      } catch {
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
