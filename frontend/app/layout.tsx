//next
import type { Metadata } from "next";

//styles 
import "./globals.css";

//components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

import { ThemeProvider } from "@/components/theme-provider";

import { SiteHeader } from "@/components/site-header";

import { TooltipProvider } from "@/components/ui/tooltip";

//providers
import { Providers } from "./providers/providers";

import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "SmartBudget PRO",
  description: "A budget management application built with Next.js, React Query, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  {children}
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
