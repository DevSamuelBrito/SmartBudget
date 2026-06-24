"use server";

//next
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

// jose
import { decodeJwt } from "jose";

import { getServerApiBaseUrl } from "@/lib/server-api";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
}

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface ProblemDetailsPayload {
  detail?: string;
}

const getApiBaseUrl = () => {
  return getServerApiBaseUrl();
};

const toStr = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback;

const normalizeLoginResponse = (payload: unknown): LoginResponse => {
  const data = payload as Record<string, unknown>;

  return {
    accessToken: toStr(data.accessToken ?? data.AccessToken, ""),
    tokenType: toStr(data.tokenType ?? data.TokenType, "Bearer"),
    expiresInSeconds: Number(
      data.expiresInSeconds ?? data.ExpiresInSeconds ?? 0,
    ),
    refreshToken: toStr(data.refreshToken ?? data.RefreshToken, ""),
    userId: toStr(data.userId ?? data.UserId, ""),
    name: toStr(data.name ?? data.Name, ""),
    email: toStr(data.email ?? data.Email, ""),
  };
};

type ActionResult<T = undefined> = T extends undefined
  ? { success: true } | { success: false; error: string }
  : { success: true; user: T } | { success: false; error: string };

export async function loginAction(
  input: LoginInput,
): Promise<ActionResult<AuthUser>> {
  try {
    const apiBaseUrl = getApiBaseUrl();

    const response = await fetch(`${apiBaseUrl}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => null)) as ProblemDetailsPayload | null;

      const message = errorData?.detail ?? "E-mail ou senha inválidos.";

      return { success: false, error: message };
    }

    const data = normalizeLoginResponse(await response.json());

    if (!data.accessToken || !data.refreshToken || !data.userId || !data.name || !data.email) {
      return { success: false, error: "Resposta de autenticação inválida." };
    }

    const cookieStore = await cookies();

    const COOKIE_BASE = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    cookieStore.set("token", data.accessToken, {
      ...COOKIE_BASE,
      maxAge: data.expiresInSeconds,
    });

    cookieStore.set("refresh-token", data.refreshToken, {
      ...COOKIE_BASE,
      maxAge: 7 * 24 * 60 * 60,
    });

    const tokenPayload = decodeJwt(data.accessToken);
    const isPremium = tokenPayload["isPremium"] === "true";

    const userData: AuthUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      isPremium,
    };

    cookieStore.set("user-data", JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true, user: userData };
  } catch {
    return { success: false, error: "Erro ao conectar com o servidor." };
  }
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  try {
    const apiBaseUrl = getApiBaseUrl();

    const response = await fetch(`${apiBaseUrl}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => null)) as ProblemDetailsPayload | null;

      const message = errorData?.detail ?? "Erro ao criar conta.";

      return { success: false, error: message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erro ao conectar com o servidor." };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("token");
  cookieStore.delete("refresh-token");
  cookieStore.delete("user-data");

  redirect("/login");
}
