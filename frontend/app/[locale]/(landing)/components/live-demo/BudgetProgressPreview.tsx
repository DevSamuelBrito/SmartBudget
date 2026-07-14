"use client";

// react
import { useEffect, useState } from "react";

// next-intl
import { useLocale, useTranslations } from "next-intl";

// lucide-react
import { UtensilsCrossed } from "lucide-react";

// components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TARGET_PERCENTAGE = 92;
const LIMIT_AMOUNT = 400;
const ANIMATION_DURATION_MS = 1600;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function getStatusClass(percentage: number): string {
  if (percentage >= 100) return "bg-rose-500";
  if (percentage >= 80) return "bg-amber-500";

  return "bg-emerald-500";
}

type BudgetProgressPreviewProps = {
  animate: boolean;
};

export function BudgetProgressPreview({ animate }: Readonly<BudgetProgressPreviewProps>) {
  const t = useTranslations("landing.demo.slides.budgetProgress");
  const locale = useLocale();

  const [percentage, setPercentage] = useState(0);

  const currency = locale === "pt-BR" ? "BRL" : "USD";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

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

      setPercentage(Math.round(easeOutExpo(progress) * TARGET_PERCENTAGE));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const spentAmount = (LIMIT_AMOUNT * percentage) / 100;
  const remainingAmount = Math.max(LIMIT_AMOUNT - spentAmount, 0);

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/70">
            <UtensilsCrossed className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-semibold leading-none">{t("category")}</p>
            <p className="mt-1.5 text-sm tabular-nums text-muted-foreground">
              {formatCurrency(spentAmount)} / {formatCurrency(LIMIT_AMOUNT)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Progress value={percentage} indicatorClassName={getStatusClass(percentage)} />

        <div className="flex items-center justify-between text-sm">
          <span className="tabular-nums text-muted-foreground">{t("used", { percentage })}</span>
          <span className="tabular-nums text-muted-foreground">
            {t("remaining", { amount: formatCurrency(remainingAmount) })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
