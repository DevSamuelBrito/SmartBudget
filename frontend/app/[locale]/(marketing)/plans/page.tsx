"use client";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { ArrowLeft, Check } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

// utils
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const t = useTranslations("plans");

  const freeFeatures: string[] = t.raw("free.features") as string[];
  const premiumFeatures: string[] = t.raw("premium.features") as string[];

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div>
        <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            {t("backToApp")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Free card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{t("free.title")}</CardTitle>
              <CardDescription>{t("free.description")}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-4xl font-bold mb-6">
                {t("free.price")}
                <span className="text-muted-foreground text-base font-normal ml-1">
                  {t("free.period")}
                </span>
              </p>
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">{t("free.continueWithFree")}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium card */}
          <Card className={cn("flex flex-col relative ring-2 ring-primary overflow-hidden")}>
            <div className="absolute top-5 -right-7 w-32 rotate-45 bg-green-500 text-white text-xs font-bold text-center py-1 shadow">
              {t("premium.ribbon")}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{t("premium.title")}</CardTitle>
              </div>
              <CardDescription>{t("premium.description")}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-primary">
                    {t("premium.promoPrice")}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="line-through">{t("premium.originalPrice")}</span>
                  {" "}
                </p>
              </div>
              <ul className="space-y-3">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/checkout">{t("premium.getPremium")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
