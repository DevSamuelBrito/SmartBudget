import { enUS, ptBR, type Locale } from "date-fns/locale";

import type { AppLocale } from "@/i18n/routing";

const DATE_FNS_LOCALES: Record<AppLocale, Locale> = {
  "pt-BR": ptBR,
  en: enUS,
};

export function getDateFnsLocale(locale: AppLocale): Locale {
  return DATE_FNS_LOCALES[locale] ?? enUS;
}
