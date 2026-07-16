// next
import type { Metadata } from "next";

// next-intl
import { getTranslations } from "next-intl/server";

// components
import { PlansScreen } from "./components/PlansScreen";

// types
import type { AppLocale } from "@/i18n/routing";

type PlansPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PlansPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.meta" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PlansPage() {
  return <PlansScreen />;
}
