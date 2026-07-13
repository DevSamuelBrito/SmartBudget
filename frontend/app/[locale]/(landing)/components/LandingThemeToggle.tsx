"use client";

// react
import { useSyncExternalStore } from "react";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "next-themes";

// components
import { Button } from "@/components/ui/button";

// hooks
import { useThemeTransition } from "@/hooks/useThemeTransition";

export function LandingThemeToggle() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const t = useTranslations("siteHeader");
  const { resolvedTheme, theme } = useTheme();
  const { changeTheme } = useThemeTransition();

  const currentTheme = resolvedTheme ?? theme;

  let themeLabel = t("toggleTheme");

  if (mounted && currentTheme) {
    themeLabel = currentTheme === "dark" ? t("toggleLight") : t("toggleDark");
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    changeTheme(currentTheme === "dark" ? "light" : "dark", event);
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
