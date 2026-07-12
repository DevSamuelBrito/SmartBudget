// next
import type { Metadata } from "next";

// next-intl
import { getTranslations } from "next-intl/server";

// components
import { LandingHeader } from "./components/LandingHeader";

import { HeroSection } from "./components/HeroSection";

import { LiveBudgetDemo } from "./components/LiveBudgetDemo";

import { DashboardGlimpse } from "./components/DashboardGlimpse";

import { FeaturesSection } from "./components/FeaturesSection";

import { ProofSection } from "./components/ProofSection";

import { FinalCtaSection } from "./components/FinalCtaSection";

import { LandingFooter } from "./components/LandingFooter";

// types
import type { AppLocale } from "@/i18n/routing";

type LandingPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      <main>
        <HeroSection />
        <LiveBudgetDemo />
        <DashboardGlimpse />
        <FeaturesSection />
        <ProofSection />
        <FinalCtaSection />
      </main>

      <LandingFooter />
    </>
  );
}
