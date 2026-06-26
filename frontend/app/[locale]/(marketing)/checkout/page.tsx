"use client";

// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { ArrowLeft, Loader2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

// hooks
import { useCheckout } from "./hooks/use-checkout";

export default function CheckoutPage() {

  const t = useTranslations("checkout");

  const { isLoading, handleSubmit } = useCheckout();

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/plans">
            <ArrowLeft className="h-4 w-4" />
            {t("backToPlans")}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
          </div>

          {/* Plan summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("planSummary.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("planSummary.plan")}</span>
                <span className="font-semibold">Premium</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("planSummary.price")}</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-muted-foreground text-xs">
                    {t("planSummary.originalPrice")}
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {t("planSummary.free")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
