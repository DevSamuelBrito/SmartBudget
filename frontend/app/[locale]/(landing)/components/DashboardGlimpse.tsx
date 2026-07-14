// next
import Image from "next/image";

// next-intl
import { useTranslations } from "next-intl";

// components
import { Reveal } from "@/components/shared/reveal";

export function DashboardGlimpse() {
  const t = useTranslations("landing.glimpse");

  return (
    <section className="bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal>
          <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-[42ch] text-lg text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal index={1} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Image
              src="/images/dashboard.png"
              alt={t("alt")}
              width={1390}
              height={750}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>

          <p className="mt-3 text-center text-sm text-muted-foreground">{t("caption")}</p>
        </Reveal>
      </div>
    </section>
  );
}
