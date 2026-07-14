// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { FileSpreadsheet, Languages, Sparkles, Target } from "lucide-react";

// components
import { Reveal } from "@/components/shared/reveal";

import { Progress } from "@/components/ui/progress";

const SECONDARY_ITEMS = [
  { key: "reports", Icon: FileSpreadsheet },
  { key: "language", Icon: Languages },
  { key: "premium", Icon: Sparkles },
] as const;

export function FeaturesSection() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
        <Reveal index={1} className="rounded-2xl bg-primary/8 p-8 sm:p-10">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="size-5" aria-hidden />
          </span>

          <h3 className="mt-6 font-heading text-2xl font-semibold tracking-[-0.01em]">
            {t("items.limits.title")}
          </h3>
          <p className="mt-3 max-w-[48ch] text-muted-foreground">{t("items.limits.description")}</p>

          <div className="mt-8 space-y-3" aria-hidden>
            <Progress value={42} indicatorClassName="bg-emerald-500" />
            <Progress value={78} indicatorClassName="bg-emerald-500" />
            <Progress value={94} indicatorClassName="bg-amber-500" />
          </div>
        </Reveal>

        <div className="flex flex-col divide-y divide-border">
          {SECONDARY_ITEMS.map(({ key, Icon }, i) => (
            <Reveal key={key} index={i + 2} className="flex gap-4 py-6 first:pt-0 last:pb-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                <Icon className="size-4.5" aria-hidden />
              </span>
              <div>
                <h3 className="font-medium">{t(`items.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`items.${key}.description`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
