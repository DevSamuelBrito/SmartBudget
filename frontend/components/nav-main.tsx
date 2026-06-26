"use client"

//next
import Link from "next/link"

import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: Readonly<{
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}>) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname?.startsWith(`/${item.url}`)

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={!!isActive} tooltip={item.title}>
                  <Link href={`/${item.url}`}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
