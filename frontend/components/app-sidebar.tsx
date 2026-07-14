"use client"

//react
import * as React from "react"

//next
import Link from "next/link"

// react-query / react-hook-form / zod / [lib]
import { motion, useReducedMotion } from "framer-motion"

// i18n
import { useTranslations } from "next-intl"

//icons
import { LayoutDashboardIcon, ArrowLeftRight, Tags, Sparkles, FileTextIcon } from "lucide-react"

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
  const shouldReduceMotion = useReducedMotion()

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
      title: t("reports"),
      url: "reports",
      icon: <FileTextIcon />,
    },
    {
      title: t("plans"),
      url: "plans",
      icon: <Sparkles />,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <motion.div
        initial={shouldReduceMotion ? false : { x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex h-full w-full flex-col"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link href="/dashboard">
                  <span className="text-base font-semibold text-primary">SmartBudget PRO</span>
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
      </motion.div>
    </Sidebar>
  )
}
