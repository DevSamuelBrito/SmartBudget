"use client"

import { useState } from "react"

import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon, LayoutDashboardIcon } from "lucide-react"

import { useQueryClient } from "@tanstack/react-query"

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

import { DashboardCustomizerSheet } from "@/app/(app)/dashboard/components/DashboardCustomizerSheet"

import { UserAccountDialog } from "@/components/user-account-dialog"


import { useAuth } from "@/contexts/auth-context"

import { logoutAction } from "@/app/actions/auth-actions"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const { dispatch } = useAuth()

  const [displayUser, setDisplayUser] = useState({
    name: user.name,
    email: user.email,
  })

  const queryClient = useQueryClient()

  const [customizerOpen, setCustomizerOpen] = useState(false)

  const [accountDialogOpen, setAccountDialogOpen] = useState(false)

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    dispatch({ type: "LOGOUT" })
    queryClient.clear()
    await logoutAction()
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
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon
                  />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon
                  />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCustomizerOpen(true)}>
                  <LayoutDashboardIcon />
                  Customizar Dashboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} disabled={isLoggingOut}>
                <LogOutIcon
                />
                {isLoggingOut ? "Logging out..." : "Log out"}
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
    </>
  )
}
