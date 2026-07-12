//react
import { Suspense } from "react";

//next
import { Bricolage_Grotesque } from "next/font/google";

import type { Metadata } from "next";

//next-intl
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

//styles 
import "./globals.css";

//components
import { ThemeProvider } from "@/components/theme-provider";

import { NavigationProgress } from "@/components/NavigationProgress";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/auth-context";

//providers
import { Providers } from "../providers/providers";


const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartBudget PRO",
  description: "A budget management application built with Next.js, React Query, and Tailwind CSS.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontHeading.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
              <AuthProvider>
                <TooltipProvider>
                  {children}
                </TooltipProvider>
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
