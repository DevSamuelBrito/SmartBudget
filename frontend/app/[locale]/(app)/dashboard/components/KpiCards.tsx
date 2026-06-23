"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
import type { DashboardKpis } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type KpiCardsProps = {
  kpis: DashboardKpis;
};

export function KpiCards({ kpis }: Readonly<KpiCardsProps>) {
  const t = useTranslations("dashboard");

  const cards = [
    {
      label: t("kpis.currentBalance.label"),
      value: kpis.currentBalance,
      description: t("kpis.currentBalance.description"),
      icon: Wallet,
      tone: "text-foreground",
    },
    {
      label: t("kpis.monthlyIncome.label"),
      value: kpis.monthlyIncome,
      description: t("kpis.monthlyIncome.description"),
      icon: ArrowUpRight,
      tone: "text-emerald-500",
    },
    {
      label: t("kpis.monthlyExpense.label"),
      value: kpis.monthlyExpense,
      description: t("kpis.monthlyExpense.description"),
      icon: ArrowDownRight,
      tone: "text-orange-500",
    },
    {
      label: t("kpis.monthlySavings.label"),
      value: kpis.monthlySavings,
      description: t("kpis.monthlySavings.description"),
      icon: PiggyBank,
      tone: kpis.monthlySavings >= 0 ? "text-emerald-500" : "text-rose-500",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="border-border/70 bg-card/90 backdrop-blur @container/card">
            <CardHeader className="space-y-0 pb-2">
              <CardDescription>{card.label}</CardDescription>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-2xl font-semibold tabular-nums @[220px]/card:text-3xl">
                  {formatCurrency(card.value)}
                </CardTitle>
                <div className={`rounded-full border border-border/60 p-2 ${card.tone}`}>
                  <Icon className="size-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
