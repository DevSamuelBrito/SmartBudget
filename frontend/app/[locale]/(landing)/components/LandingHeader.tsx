"use client";

// react
import { useEffect, useState } from "react";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { Globe, Menu } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { LanguageSwitcherDialog } from "@/components/language-switcher-dialog";

import { LandingThemeToggle } from "./LandingThemeToggle";

// hooks
import { useAuth } from "@/contexts/auth-context";

// apis / services
import { setLocaleAction } from "@/app/actions/locale-actions";

// types
import type { AppLocale } from "@/i18n/routing";

function GithubIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.55-3.87-1.55-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

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
      <a href="#opensource" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
        {t("openSource")}
      </a>
      <a href="#plans" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
        {t("plans")}
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
          <span className="font-heading text-lg font-semibold tracking-tight">SmartBudget</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">{navLinks}</nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" aria-label="GitHub" asChild>
            <a href="https://github.com/DevSamuelBrito/SmartBudget" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" />
            </a>
          </Button>

          <LandingThemeToggle />

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

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" aria-label="GitHub" asChild>
            <a href="https://github.com/DevSamuelBrito/SmartBudget" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" />
            </a>
          </Button>

          <LandingThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
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
                <SheetClose asChild>
                  <a href="#opensource" className="text-base font-medium">
                    {t("openSource")}
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a href="#plans" className="text-base font-medium">
                    {t("plans")}
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
