"use client";

// react
import { useEffect } from "react";

// next-intl
import { useTranslations } from "next-intl";

// sonner
import { toast } from "sonner";

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

// hooks
import { useUpgradeToPremium } from "../hooks/use-upgrade-to-premium";

// utils
import { cn } from "@/lib/utils";

export function PlansScreen() {
  
  const t = useTranslations("plans");

  const { isPremium, upgrade, isLoading, isSuccess, error } =
    useUpgradeToPremium();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(t("upgradeSuccess"));
    }
  }, [isSuccess, t]);

  const freeFeatures: string[] = t.raw("free.features") as string[];
  const premiumFeatures: string[] = t.raw("premium.features") as string[];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        {/* Free card */}
        <Card className={cn(!isPremium && "ring-2 ring-primary")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("free.title")}</CardTitle>
              {!isPremium && (
                <Badge variant="secondary">{t("currentPlan")}</Badge>
              )}
            </div>
            <CardDescription>{t("free.description")}</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold mb-4">
              {t("free.price")}
              <span className="text-muted-foreground text-sm font-normal ml-1">
                {t("free.period")}
              </span>
            </p>
            <ul className="space-y-2">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              {t("free.cta")}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium card */}
        <Card className={cn(isPremium && "ring-2 ring-primary")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("premium.title")}</CardTitle>
              {isPremium && (
                <Badge variant="secondary">{t("currentPlan")}</Badge>
              )}
            </div>
            <CardDescription>{t("premium.description")}</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold mb-4">
              {t("premium.price")}
              <span className="text-muted-foreground text-sm font-normal ml-1">
                {t("premium.period")}
              </span>
            </p>
            <ul className="space-y-2">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              disabled={isPremium || isLoading}
              onClick={() => {
                upgrade();
              }}
            >
              {isPremium
                ? t("free.cta")
                : isLoading
                  ? t("premium.upgrading")
                  : t("premium.cta")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
