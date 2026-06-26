"use client"

//react
import { useSyncExternalStore } from "react"

//next
import { usePathname } from "next/navigation"

// i18n
import { useTranslations } from "next-intl"

//libs
import { MoonStar, SunMedium } from "lucide-react"

import { useTheme } from "next-themes"

//components
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  )

  const pathname = usePathname()
  const t = useTranslations("siteHeader")
  const tNav = useTranslations("nav")

  const { resolvedTheme, theme, setTheme } = useTheme()

  const PAGE_KEYS = ["dashboard", "transactions", "categories", "plans"] as const
  
  type PageKey = typeof PAGE_KEYS[number]

  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";

  const title = PAGE_KEYS.includes(lastSegment as PageKey)
    ? tNav(lastSegment as PageKey)
    : "Dashboard";

  const currentTheme = resolvedTheme ?? theme

  let themeLabel = t("toggleTheme");

  if (mounted && currentTheme) {
    if (currentTheme === "dark") {
      themeLabel = t("toggleLight");
    } else {
      themeLabel = t("toggleDark");
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex flex-1 items-center justify-between gap-3">
          <h1 className="text-base font-medium">{title}</h1>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label={themeLabel}
            disabled={!mounted}
          >
            <SunMedium className="size-4 dark:hidden" />
            <MoonStar className="hidden size-4 dark:block" />
          </Button>
        </div>
      </div>
    </header>
  )
}
