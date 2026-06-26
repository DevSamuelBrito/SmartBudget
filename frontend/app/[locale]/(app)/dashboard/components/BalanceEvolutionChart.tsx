"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { BarChart2 } from "lucide-react";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { EmptyState } from "./EmptyState";

// Types
import type { DashboardBalanceEvolutionPoint } from "../types";

type BalanceEvolutionChartProps = {
  data: DashboardBalanceEvolutionPoint[];
};

export function BalanceEvolutionChart({ data }: Readonly<BalanceEvolutionChartProps>) {
  const t = useTranslations("dashboard");

  const chartConfig = {
    balance: {
      label: t("charts.balanceEvolution.balance"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const chartData = data.map((point) => ({
    date: new Date(point.date).getDate().toString().padStart(2, "0"),
    balance: point.balance,
  }));

  const isEmpty = data.every((point) => point.balance === 0);

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>{t("charts.balanceEvolution.title")}</CardTitle>
        <CardDescription>{t("charts.balanceEvolution.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={BarChart2}
            title={t("emptyState.title")}
            description={t("charts.balanceEvolution.emptyState")}
          />
        ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-70 w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#fillBalance)"
              stroke="var(--color-balance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
