// next
import Link from "next/link";

// next-intl
import { useTranslations } from "next-intl";

// components
import { Reveal } from "@/components/shared/reveal";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  const t = useTranslations("landing.finalCta");

  return (
    <section className="bg-primary py-24 text-primary-foreground sm:py-28">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6">
        <h2 className="text-balance font-heading text-[clamp(1.875rem,2.2vw+1.5rem,2.75rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-[48ch] text-lg text-primary-foreground/85">{t("description")}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-lg bg-foreground px-6 text-base text-background hover:bg-foreground/85"
          >
            <Link href="/login?mode=register">{t("primaryCta")}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-lg border-primary-foreground/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/login">{t("secondaryCta")}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
