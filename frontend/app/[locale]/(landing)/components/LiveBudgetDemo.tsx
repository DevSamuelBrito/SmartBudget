"use client";

// react
import { useEffect, useRef, useState } from "react";

// next-intl
import { useLocale, useTranslations } from "next-intl";

// lucide-react
import { UtensilsCrossed } from "lucide-react";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

const TARGET_PERCENTAGE = 92;
const LIMIT_AMOUNT = 400;
const ANIMATION_DURATION_MS = 1600;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function getStatusClass(percentage: number): string {
  if (percentage >= 100) return "bg-destructive";
  if (percentage >= 80) return "bg-amber-500";
  
return "bg-emerald-500";
}

export function LiveBudgetDemo() {
  const t = useTranslations("landing.demo");
  const locale = useLocale();

  const ref = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const currency = locale === "pt-BR" ? "BRL" : "USD";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

  useEffect(() => {
    const node = ref.current;

    if (!node || hasAnimated) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(node);
        setHasAnimated(true);

        if (reduceMotion) {
          setPercentage(TARGET_PERCENTAGE);
          
return;
        }

        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / ANIMATION_DURATION_MS, 1);

          setPercentage(Math.round(easeOutExpo(progress) * TARGET_PERCENTAGE));

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const spentAmount = (LIMIT_AMOUNT * percentage) / 100;
  const remainingAmount = Math.max(LIMIT_AMOUNT - spentAmount, 0);

  return (
    <section id="demo" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div ref={ref} className="mx-auto mt-12 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/70">
                <UtensilsCrossed className="size-4" aria-hidden />
              </span>
              <div>
                <CardTitle>{t("category")}</CardTitle>
                <CardDescription className="tabular-nums">
                  {formatCurrency(spentAmount)} / {formatCurrency(LIMIT_AMOUNT)}
                </CardDescription>
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

            {percentage >= 80 && (
              <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                {t("statusWarning")}
              </p>
            )}
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">{t("caption")}</p>
      </div>
    </section>
  );
}
