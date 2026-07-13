// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { ArrowUpRight } from "lucide-react";

// components
import { Reveal } from "@/components/shared/reveal";

const BADGES = [
  {
    key: "ciLabel",
    href: "https://github.com/DevSamuelBrito/SmartBudget/actions/workflows/ci.yml",
    src: "https://github.com/DevSamuelBrito/SmartBudget/actions/workflows/ci.yml/badge.svg",
  },
  {
    key: "sonarLabel",
    href: "https://sonarcloud.io/summary/new_code?id=DevSamuelBrito_SmartBudget",
    src: "https://sonarcloud.io/api/project_badges/measure?project=DevSamuelBrito_SmartBudget&metric=alert_status",
  },
  {
    key: "snykLabel",
    href: "https://snyk.io/test/github/DevSamuelBrito/SmartBudget",
    src: "https://snyk.io/test/github/DevSamuelBrito/SmartBudget/badge.svg",
  },
] as const;

export function ProofSection() {
  const t = useTranslations("landing.proof");

  return (
    <section id="opensource" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-[clamp(2rem,2.5vw+1.5rem,3rem)] font-semibold tracking-[-0.02em]">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </Reveal>

      <Reveal index={1} className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {BADGES.map(({ key, href, src }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-center"
          >
            <img src={src} alt="" className="h-6" />
            <span className="text-sm text-muted-foreground">{t(key)}</span>
          </a>
        ))}
      </Reveal>

      <Reveal index={2} className="mt-10 text-center">
        <a
          href="https://github.com/DevSamuelBrito/SmartBudget"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {t("repoLink")}
          <ArrowUpRight className="size-4" />
        </a>
      </Reveal>
    </section>
  );
}
