"use client"

// React
import { useState } from "react"

// i18n
import { useTranslations } from "next-intl"

// libs
import { EllipsisVerticalIcon, CircleUserRoundIcon, LogOutIcon, LayoutDashboardIcon, FlagIcon } from "lucide-react"

import { useQueryClient } from "@tanstack/react-query"

// Components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { DashboardCustomizerSheet } from "@/app/[locale]/(app)/dashboard/components/DashboardCustomizerSheet"

import { LanguageSwitcherDialog } from "@/components/language-switcher-dialog"

import { UserAccountDialog } from "@/components/user-account-dialog"

// contexts
import { useAuth } from "@/contexts/auth-context"

// APIs / Services
import { logoutAction } from "@/app/actions/auth-actions"

import { setLocaleAction } from "@/app/actions/locale-actions"

// types
import { type AppLocale } from "@/i18n/routing"

export function NavUser({
  user,
}:Readonly<{
  user: {
    name: string
    email: string
    avatar: string
  }
}>) {
  const t = useTranslations("user")

  const { isMobile } = useSidebar()

  const { dispatch } = useAuth()

  const [displayUser, setDisplayUser] = useState({
    name: user.name,
    email: user.email,
  })

  const queryClient = useQueryClient()

  const [customizerOpen, setCustomizerOpen] = useState(false)

  const [accountDialogOpen, setAccountDialogOpen] = useState(false)

  const [localeDialogOpen, setLocaleDialogOpen] = useState(false)

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [isChangingLocale, setIsChangingLocale] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    dispatch({ type: "LOGOUT" })
    queryClient.clear()
    await logoutAction()
  }

  const handleChangeLocale = async (locale: AppLocale) => {
    setIsChangingLocale(true)
    await setLocaleAction(locale)
    setLocaleDialogOpen(false)
    window.location.reload()
    setIsChangingLocale(false)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={displayUser.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {displayUser.email}
                  </span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={displayUser.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayUser.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displayUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setAccountDialogOpen(true)}>
                  <CircleUserRoundIcon
                  />
                  {t("account")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCustomizerOpen(true)}>
                  <LayoutDashboardIcon />
                  {t("customizeDashboard")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocaleDialogOpen(true)}>
                  <FlagIcon />
                  {t("language")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} disabled={isLoggingOut}>
                <LogOutIcon
                />
                {isLoggingOut ? t("loggingOut") : t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DashboardCustomizerSheet open={customizerOpen} onOpenChange={setCustomizerOpen} />
      <UserAccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        onProfileUpdated={(nextProfile) => {
          setDisplayUser(nextProfile)
        }}
      />
      <LanguageSwitcherDialog
        open={localeDialogOpen}
        onOpenChange={setLocaleDialogOpen}
        isChangingLocale={isChangingLocale}
        onChangeLocale={handleChangeLocale}
      />
    </>
  )
}
