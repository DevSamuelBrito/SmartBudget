"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { CommandIcon, Globe } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { LanguageSwitcherDialog } from "@/components/language-switcher-dialog";

// apis / services
import { setLocaleAction } from "@/app/actions/locale-actions";

// types
import type { AppLocale } from "@/i18n/routing";

export function LandingFooter() {
  const t = useTranslations("landing.footer");

  const [languageOpen, setLanguageOpen] = useState(false);
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  const handleChangeLocale = async (locale: AppLocale) => {
    setIsChangingLocale(true);
    await setLocaleAction(locale);
    window.location.reload();
  };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <CommandIcon className="size-4.5 text-primary" aria-hidden />
            <span className="font-heading text-base font-semibold tracking-tight">SmartBudget</span>
          </Link>
          <p className="max-w-[36ch] text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            {t("loginLink")}
          </Link>
          <Link href="/plans" className="text-sm text-muted-foreground hover:text-foreground">
            {t("plansLink")}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1.5 px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={() => setLanguageOpen(true)}
          >
            <Globe className="size-4" />
            {t("languageLabel")}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <p className="text-xs text-muted-foreground">{t("rights", { year: new Date().getFullYear() })}</p>
      </div>

      <LanguageSwitcherDialog
        open={languageOpen}
        onOpenChange={setLanguageOpen}
        isChangingLocale={isChangingLocale}
        onChangeLocale={handleChangeLocale}
      />
    </footer>
  );
}
