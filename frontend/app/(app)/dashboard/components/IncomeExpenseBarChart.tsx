"use client";

// Libs
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, } from "recharts";

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

const chartConfig = {
  income: {
    label: "Receitas",
    color: "var(--color-emerald-500, #10b981)",
  },
  expense: {
    label: "Despesas",
    color: "var(--color-orange-500, #f97316)",
  },
} satisfies ChartConfig;

const MONTH_LABELS = [
  "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function IncomeExpenseBarChart({ data }: IncomeExpenseBarChartProps) {
  const chartData = data.map((item) => ({
    label: `${MONTH_LABELS[item.month]}/${String(item.year).slice(2)}`,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Receitas x Despesas</CardTitle>
        <CardDescription>Comparativo mensal</CardDescription>
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
