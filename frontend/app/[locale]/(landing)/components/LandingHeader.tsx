"use client";

// react
import { useEffect, useState } from "react";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { CommandIcon, Globe, Menu } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { LanguageSwitcherDialog } from "@/components/language-switcher-dialog";

// hooks
import { useAuth } from "@/contexts/auth-context";

// apis / services
import { setLocaleAction } from "@/app/actions/locale-actions";

// types
import type { AppLocale } from "@/i18n/routing";

export function LandingHeader() {
  const t = useTranslations("landing.nav");
  const tLanguage = useTranslations("languageSwitcher");

  const { state } = useAuth();
  const isLoggedIn = Boolean(state.user);

  const [isScrolled, setIsScrolled] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isChangingLocale, setIsChangingLocale] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChangeLocale = async (locale: AppLocale) => {
    setIsChangingLocale(true);
    await setLocaleAction(locale);
    window.location.reload();
  };

  const navLinks = (
    <>
      <a href="#features" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
        {t("features")}
      </a>
      <a href="#demo" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
        {t("demo")}
      </a>
    </>
  );

  return (
    <header
      data-scrolled={isScrolled}
      className="sticky top-0 z-40 border-b border-transparent bg-background/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:shadow-[0_1px_3px_0_hsl(0_0%_0%/0.06)]"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CommandIcon className="size-5 text-primary" aria-hidden />
          <span className="font-heading text-lg font-semibold tracking-tight">SmartBudget</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">{navLinks}</nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" aria-label={tLanguage("title")} onClick={() => setLanguageOpen(true)}>
            <Globe className="size-4" />
          </Button>

          {isLoggedIn ? (
            <Button asChild>
              <Link href="/dashboard">{t("goToDashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/login?mode=register">{t("cta")}</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col gap-6 p-6">
            <SheetTitle className="font-heading">SmartBudget</SheetTitle>
            <nav className="flex flex-col gap-4">
              <SheetClose asChild>
                <a href="#features" className="text-base font-medium">
                  {t("features")}
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#demo" className="text-base font-medium">
                  {t("demo")}
                </a>
              </SheetClose>
            </nav>
            <div className="mt-auto flex flex-col gap-2">
              <Button variant="outline" onClick={() => setLanguageOpen(true)}>
                <Globe className="size-4" />
                {tLanguage("title")}
              </Button>
              {isLoggedIn ? (
                <Button asChild>
                  <Link href="/dashboard">{t("goToDashboard")}</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">{t("login")}</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/login?mode=register">{t("cta")}</Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <LanguageSwitcherDialog
        open={languageOpen}
        onOpenChange={setLanguageOpen}
        isChangingLocale={isChangingLocale}
        onChangeLocale={handleChangeLocale}
      />
    </header>
  );
}
