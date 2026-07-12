// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { ChevronDown } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

const RISE = "opacity-0 animate-[hero-rise_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100";

export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-[60rem] rounded-full bg-[oklch(0.95_0.08_152.2/0.5)] blur-3xl"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-start px-4 py-28 sm:px-6 sm:py-36">
        <h1
          className={`${RISE} text-balance font-heading text-[clamp(2.75rem,4vw+1.75rem,5.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]`}
          style={{ animationDelay: "0ms" }}
        >
          {t("headline")}
        </h1>

        <p
          className={`${RISE} mt-8 max-w-[42ch] text-lg leading-relaxed text-primary-foreground/85 sm:text-xl`}
          style={{ animationDelay: "150ms" }}
        >
          {t("subhead")}
        </p>

        <div className={`${RISE} mt-10 flex flex-col gap-3 sm:flex-row`} style={{ animationDelay: "280ms" }}>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-lg bg-foreground px-6 text-base text-background hover:bg-foreground/85 dark:bg-foreground dark:text-background dark:hover:bg-foreground/85"
          >
            <a href="#demo">{t("primaryCta")}</a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-lg border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/login?mode=register">{t("secondaryCta")}</Link>
          </Button>
        </div>

        <a
          href="#demo"
          className={`${RISE} mt-16 flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground`}
          style={{ animationDelay: "400ms" }}
        >
          {t("scrollHint")}
          <ChevronDown className="size-4 animate-[scroll-hint_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
        </a>
      </div>
    </section>
  );
}
