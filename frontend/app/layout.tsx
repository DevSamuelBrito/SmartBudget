//react
import { Suspense } from "react";

//next
import type { Metadata } from "next";

//styles 
import "./globals.css";

//components
import { ThemeProvider } from "@/components/theme-provider";

import { NavigationProgress } from "@/components/NavigationProgress";

import { TooltipProvider } from "@/components/ui/tooltip";

//providers
import { Providers } from "../providers/providers";


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
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
