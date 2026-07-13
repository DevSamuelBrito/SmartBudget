"use client"

// react
import { useSyncExternalStore } from "react"

// i18n
import { useTranslations } from "next-intl"

// libs
import { MoonStar, SunMedium } from "lucide-react"

import { useTheme } from "next-themes"

// components
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  )

  const t = useTranslations("siteHeader")
  const { resolvedTheme, theme, setTheme } = useTheme()

  const currentTheme = resolvedTheme ?? theme

  let themeLabel = t("toggleTheme")

  if (mounted && currentTheme) {
    themeLabel = currentTheme === "dark" ? t("toggleLight") : t("toggleDark")
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label={themeLabel}
      disabled={!mounted}
    >
      <SunMedium className="size-4 dark:hidden" />
      <MoonStar className="hidden size-4 dark:block" />
    </Button>
  )
}
