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

import { PlansSection } from "./components/PlansSection";

import { FinalCtaSection } from "./components/FinalCtaSection";

import { LandingFooter } from "./components/LandingFooter";

// types
import type { AppLocale } from "@/i18n/routing";

// utils
import { SITE_NAME, SITE_OG_IMAGE } from "@/lib/site-config";

type LandingPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.meta" });

  const title = t("title");
  const description = t("description");
  const keywords = t.raw("keywords") as string[];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: SITE_NAME,
      title,
      description,
      locale: locale === "en" ? "en_US" : "pt_BR",
      alternateLocale: locale === "en" ? ["pt_BR"] : ["en_US"],
      images: [{ ...SITE_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  };
}

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      <main>
        <HeroSection />
        <FeaturesSection />
        <LiveBudgetDemo />
        <DashboardGlimpse />
        <ProofSection />
        <PlansSection />
        <FinalCtaSection />
      </main>

      <LandingFooter />
    </>
  );
}
