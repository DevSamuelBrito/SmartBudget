"use client";

// react
import { useEffect, useRef, useState } from "react";

// next-intl
import { useTranslations } from "next-intl";

// components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// components
import { BudgetProgressPreview } from "./live-demo/BudgetProgressPreview";

import { CategoryDistributionPreview } from "./live-demo/CategoryDistributionPreview";

import { IncomeExpensePreview } from "./live-demo/IncomeExpensePreview";

import { FinancialRiskPreview } from "./live-demo/FinancialRiskPreview";

// utils
import { cn } from "@/lib/utils";

const SLIDE_KEYS = ["budgetProgress", "categoryDistribution", "incomeExpense", "financialRisk"] as const;

export function LiveBudgetDemo() {
  const t = useTranslations("landing.demo");

  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(node);
        setHasAnimated(true);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

    const frame = requestAnimationFrame(onSelect);

    api.on("select", onSelect);

    return () => {
      cancelAnimationFrame(frame);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section id="demo" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div ref={sectionRef} className="mx-auto mt-12 max-w-md">
        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }} className="px-2">
          <CarouselContent>
            {SLIDE_KEYS.map((key) => (
              <CarouselItem key={key} className="flex flex-col justify-center">
                {key === "budgetProgress" && <BudgetProgressPreview animate={hasAnimated} />}
                {key === "categoryDistribution" && <CategoryDistributionPreview />}
                {key === "incomeExpense" && <IncomeExpensePreview />}
                {key === "financialRisk" && <FinancialRiskPreview animate={hasAnimated} />}

                <div className="mt-4 text-center">
                  <p className="font-semibold">{t(`slides.${key}.title`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`slides.${key}.description`)}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious aria-label={t("previousSlide")} />
          <CarouselNext aria-label={t("nextSlide")} />
        </Carousel>

        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDE_KEYS.map((key, index) => (
            <button
              key={key}
              type="button"
              aria-label={t("goToSlide", { number: index + 1 })}
              aria-current={index === selectedIndex}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === selectedIndex ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
