"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Types
import type { DashboardIncomeExpenseByMonth } from "../types";

type IncomeExpenseBarChartProps = {
  data: DashboardIncomeExpenseByMonth[];
};

export function IncomeExpenseBarChart({ data }: Readonly<IncomeExpenseBarChartProps>) {
  const t = useTranslations("dashboard");

  const chartConfig = {
    income: {
      label: t("charts.incomeExpense.income"),
      color: "var(--color-emerald-500, #10b981)",
    },
    expense: {
      label: t("charts.incomeExpense.expense"),
      color: "var(--color-orange-500, #f97316)",
    },
  } satisfies ChartConfig;

  const monthLabels = t.raw("charts.incomeExpense.months") as Record<string, string>;

  const chartData = data.map((item) => ({
    label: `${monthLabels[
      ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][item.month - 1]
    ]}/${String(item.year).slice(2)}`,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>{t("charts.incomeExpense.title")}</CardTitle>
        <CardDescription>{t("charts.incomeExpense.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
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
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
