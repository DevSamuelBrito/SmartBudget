import { Suspense } from "react"

import type { Metadata } from "next"

import { getTranslations } from "next-intl/server"

import { LoginCard } from "./components/login-card"

import type { AppLocale } from "@/i18n/routing"

type LoginPageProps = {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ mode?: string }>
}

export async function generateMetadata({ params, searchParams }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params
  const { mode } = await searchParams

  const namespace = mode === "register" ? "auth.registerMeta" : "auth.loginMeta"
  const t = await getTranslations({ locale, namespace })

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </div>
  )
}
