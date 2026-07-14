"use client";

// next
import Link from "next/link";

// react-query / react-hook-form / zod / [lib]
import { motion, useReducedMotion } from "framer-motion";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { Check } from "lucide-react";

// components
import { Reveal } from "@/components/shared/reveal";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// utils
import { cn } from "@/lib/utils";

export function PlansSection() {
  const t = useTranslations("plans");
  const shouldReduceMotion = useReducedMotion();

  const freeFeatures: string[] = t.raw("free.features") as string[];

  const premiumFeatures: string[] = t.raw("premium.features") as string[];

  return (
    <section id="plans" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Free card */}
        <Reveal index={1}>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Card className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{t("free.title")}</CardTitle>
                <CardDescription>{t("free.description")}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="mb-6 text-4xl font-bold">
                  {t("free.price")}
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    {t("free.period")}
                  </span>
                </p>
                <ul className="space-y-3">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </Reveal>

        {/* Premium card */}
        <Reveal index={2}>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Card className={cn("relative flex h-full flex-col overflow-hidden ring-2 ring-primary")}>
              <div className="absolute top-5 -right-7 w-32 rotate-45 bg-green-500 py-1 text-center text-xs font-bold text-white shadow">
                {t("premium.ribbon")}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t("premium.title")}</CardTitle>
                <CardDescription>{t("premium.description")}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">{t("premium.promoPrice")}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="line-through">{t("premium.originalPrice")}</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  {premiumFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </Reveal>
      </div>

      <Reveal index={3} className="mt-12 text-center">
        <Button asChild size="lg" className="h-12 rounded-lg px-6 text-base">
          <Link href="/plans">{t("viewFullPlans")}</Link>
        </Button>
      </Reveal>
    </section>
  );
}
