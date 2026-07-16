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

//utils
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site-config";


const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const DEFAULT_TITLE = "SmartBudget PRO — Controle financeiro pessoal simples e inteligente";

const DEFAULT_DESCRIPTION =
  "Organize categorias, defina orçamentos por mês e acompanhe tudo em um dashboard único: o SmartBudget PRO transforma o controle financeiro pessoal em um hábito simples e inteligente.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    images: [
      {
        ...SITE_OG_IMAGE,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
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
