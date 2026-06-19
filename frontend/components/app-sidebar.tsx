"use client"

//react
import * as React from "react"

// i18n
import { useTranslations } from "next-intl"

//components
import { LayoutDashboardIcon, CommandIcon, ArrowLeftRight, Tags, Sparkles } from "lucide-react"

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
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">SmartBudget PRO</span>
              </a>
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
