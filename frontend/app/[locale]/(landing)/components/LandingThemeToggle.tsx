"use client";

// react
import { useSyncExternalStore } from "react";

import { flushSync } from "react-dom";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "next-themes";

// components
import { Button } from "@/components/ui/button";

function playCircularReveal(x: number, y: number) {
  const root = document.documentElement;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--theme-toggle-x", `${x}px`);
  root.style.setProperty("--theme-toggle-y", `${y}px`);
  root.style.setProperty("--theme-toggle-radius", `${endRadius}px`);
}

export function LandingThemeToggle() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const t = useTranslations("siteHeader");
  const { resolvedTheme, theme, setTheme } = useTheme();

  const currentTheme = resolvedTheme ?? theme;

  let themeLabel = t("toggleTheme");

  if (mounted && currentTheme) {
    themeLabel = currentTheme === "dark" ? t("toggleLight") : t("toggleDark");
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      setTheme(nextTheme);

      return;
    }

    playCircularReveal(event.clientX, event.clientY);

    document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      aria-label={themeLabel}
      disabled={!mounted}
    >
      <SunMedium className="size-4 dark:hidden" />
      <MoonStar className="hidden size-4 dark:block" />
    </Button>
  );
}
