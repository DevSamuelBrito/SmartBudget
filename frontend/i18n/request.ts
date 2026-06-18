import { cookies, headers } from "next/headers";

import { getRequestConfig } from "next-intl/server";

import { routing, type AppLocale } from "./routing";

const DEFAULT_LOCALE: AppLocale = routing.defaultLocale;

const isSupportedLocale = (value: string): value is AppLocale => {
  return routing.locales.includes(value as AppLocale);
};

const normalizeLocale = (value: string | undefined): AppLocale | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace("_", "-");

  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  const lower = normalized.toLowerCase();

  if (lower.startsWith("pt")) {
    return "pt-BR";
  }

  if (lower.startsWith("en")) {
    return "en";
  }

  return null;
};

const detectLocaleFromAcceptLanguage = (
  headerValue: string | null,
): AppLocale => {
  if (!headerValue) {
    return DEFAULT_LOCALE;
  }

  const rankedLocales = headerValue
    .split(",")
    .map((part) => {
      const [language, qualityPart] = part.trim().split(";");

      const quality = qualityPart?.startsWith("q=")
        ? Number(qualityPart.slice(2))
        : 1;

      return {
        language,
        quality: Number.isNaN(quality) ? 0 : quality,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of rankedLocales) {
    const locale = normalizeLocale(candidate.language);

    if (locale) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestHeaders = await headers();

  const localeFromCookie = normalizeLocale(
    cookieStore.get("NEXT_LOCALE")?.value,
  );

  const localeFromHeader = detectLocaleFromAcceptLanguage(
    requestHeaders.get("accept-language"),
  );

  const locale = localeFromCookie ?? localeFromHeader ?? DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
