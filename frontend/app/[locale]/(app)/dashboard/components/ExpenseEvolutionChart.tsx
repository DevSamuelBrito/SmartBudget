"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { TrendingDown } from "lucide-react";

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
import type { DashboardExpenseByMonth } from "../types";

type ExpenseEvolutionChartProps = {
  data: DashboardExpenseByMonth[];
};

export function ExpenseEvolutionChart({ data }: Readonly<ExpenseEvolutionChartProps>) {
  const t = useTranslations("dashboard");

  const chartConfig = {
    expense: {
      label: t("charts.expenseEvolution.expense"),
      color: "var(--color-orange-500, #f97316)",
    },
  } satisfies ChartConfig;

  const monthLabels = t.raw("charts.incomeExpense.months") as Record<string, string>;
  const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  const chartData = data.map((item) => ({
    label: `${monthLabels[monthKeys[item.month - 1]]}/${String(item.year).slice(2)}`,
    expense: item.expense,
  }));

  const isEmpty = data.every((item) => item.expense === 0);

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>{t("charts.expenseEvolution.title")}</CardTitle>
        <CardDescription>{t("charts.expenseEvolution.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={TrendingDown}
            title={t("emptyState.title")}
            description={t("charts.expenseEvolution.emptyState")}
          />
        ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-70 w-full">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
