"use client";

// react
import { useEffect, useState } from "react";

// next-intl
import { useLocale, useTranslations } from "next-intl";

// lucide-react
import { ShieldAlert } from "lucide-react";

// components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TARGET_PERCENTAGE = 78.4;
const AVERAGE_INCOME = 5200;
const FIXED_EXPENSES = 4077;
const ANIMATION_DURATION_MS = 1600;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

type FinancialRiskPreviewProps = {
  animate: boolean;
};

export function FinancialRiskPreview({ animate }: Readonly<FinancialRiskPreviewProps>) {
  const t = useTranslations("landing.demo.slides.financialRisk");
  const locale = useLocale();

  const [percentage, setPercentage] = useState(0);

  const currency = locale === "pt-BR" ? "BRL" : "USD";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

  const formatPercentage = (value: number) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

  useEffect(() => {
    if (!animate) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame: number;

    if (reduceMotion) {
      frame = requestAnimationFrame(() => setPercentage(TARGET_PERCENTAGE));

      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / ANIMATION_DURATION_MS, 1);

      setPercentage(Number((easeOutExpo(progress) * TARGET_PERCENTAGE).toFixed(1)));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const percentageLabel = `${formatPercentage(percentage)}%`;

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <p className="font-semibold">{t("badge")}</p>
          <div className="rounded-full border border-border/60 bg-amber-500/10 p-2 text-amber-500">
            <ShieldAlert className="size-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold tabular-nums">{percentageLabel}</p>
            <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("status.warning")}
            </span>
          </div>

          <Progress value={percentage} indicatorClassName="bg-amber-500" />
        </div>

        <p className="text-sm text-muted-foreground">{t("warningMessage")}</p>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("averageIncome")}</p>
          <p className="mt-2 text-lg font-semibold tabular-nums">{formatCurrency(AVERAGE_INCOME)}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("fixedExpenses")}</p>
          <p className="mt-2 text-lg font-semibold tabular-nums">{formatCurrency(FIXED_EXPENSES)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
