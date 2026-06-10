"use client"

//react
import { useSyncExternalStore } from "react"

//lucide
import { usePathname } from "next/navigation"

import { MoonStar, SunMedium } from "lucide-react"

//next

//next
import { useTheme } from "next-themes"

//components
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const pathname = usePathname()

  const { resolvedTheme, theme, setTheme } = useTheme()

  const title =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .split("/")
          .filter(Boolean)
          .map((segment) =>
            segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (character) => character.toUpperCase())
          )
          .join(" / ") || "Dashboard"

  const currentTheme = resolvedTheme ?? theme

  const themeLabel =
    !mounted || !currentTheme
      ? "Alternar tema"
      : currentTheme === "dark"
        ? "Alternar para modo claro"
        : "Alternar para modo escuro"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
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
