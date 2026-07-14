"use client";

// next-intl
import { useTranslations } from "next-intl";

// recharts
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const MOCK_DATA = [
  { monthKey: "jan", income: 5200, expense: 3800 },
  { monthKey: "feb", income: 5200, expense: 4100 },
  { monthKey: "mar", income: 5400, expense: 3950 },
  { monthKey: "apr", income: 5400, expense: 4300 },
  { monthKey: "may", income: 5600, expense: 4000 },
  { monthKey: "jun", income: 5600, expense: 4550 },
];

export function IncomeExpensePreview() {
  const t = useTranslations("landing.demo.slides.incomeExpense");

  const chartConfig = {
    income: { label: t("income"), color: "#10b981" },
    expense: { label: t("expense"), color: "#f97316" },
  } satisfies ChartConfig;

  const chartData = MOCK_DATA.map((item) => ({
    label: t(`months.${item.monthKey}`),
    income: item.income,
    expense: item.expense,
  }));

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader className="flex flex-row items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          {t("income")}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="size-2.5 rounded-full bg-orange-500" />
          {t("expense")}
        </span>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value))}
            />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
