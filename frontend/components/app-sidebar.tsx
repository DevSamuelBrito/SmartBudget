"use client"

//react
import * as React from "react"

//next
import Link from "next/link"

// i18n
import { useTranslations } from "next-intl"

//icons
import { LayoutDashboardIcon, CommandIcon, ArrowLeftRight, Tags, Sparkles } from "lucide-react"

//components
import { NavMain } from "@/components/nav-main"

import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type SidebarUser = {
  name: string
  email: string
  avatar?: string
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser
}) {
  const t = useTranslations("nav")

  const navMain = [
    {
      title: t("dashboard"),
      url: "dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: t("transactions"),
      url: "transactions",
      icon: <ArrowLeftRight />,
    },
    {
      title: t("categories"),
      url: "categories",
      icon: <Tags />,
    },
    {
      title: t("plans"),
      url: "plans",
      icon: <Sparkles />,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">SmartBudget PRO</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
