"use server";

import { cookies } from "next/headers";

import { type AppLocale, routing } from "@/i18n/routing";

const isSupportedLocale = (value: string): value is AppLocale => {
  return routing.locales.includes(value as AppLocale);
};

export async function setLocaleAction(locale: string): Promise<void> {
  if (!isSupportedLocale(locale)) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set("NEXT_LOCALE", locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
}
