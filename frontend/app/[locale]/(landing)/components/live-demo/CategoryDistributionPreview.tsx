"use client";

// next-intl
import { useLocale, useTranslations } from "next-intl";

// recharts
import { Cell, Legend, Pie, PieChart } from "recharts";

// components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const PIE_COLORS = ["#8b5cf6", "#0ea5e9", "#10b981", "#f97316", "#f43f5e"];

const MOCK_AMOUNTS = {
  housing: 1450,
  food: 820,
  transport: 540,
  leisure: 430,
  other: 760,
} as const;

export function CategoryDistributionPreview() {
  const t = useTranslations("landing.demo.slides.categoryDistribution");
  const locale = useLocale();

  const currency = locale === "pt-BR" ? "BRL" : "USD";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

  const entries = Object.entries(MOCK_AMOUNTS) as Array<[keyof typeof MOCK_AMOUNTS, number]>;

  const chartData = entries.map(([key, amount], index) => ({
    name: t(`categories.${key}`),
    value: amount,
    fill: PIE_COLORS[index],
  }));

  const chartConfig = entries.reduce<ChartConfig>((acc, [key], index) => {
    acc[key] = { label: t(`categories.${key}`), color: PIE_COLORS[index] };

    return acc;
  }, {});

  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <p className="font-semibold">{t("totalLabel")}</p>
        <p className="text-sm tabular-nums text-muted-foreground">
          {formatCurrency(Object.values(MOCK_AMOUNTS).reduce((sum, value) => sum + value, 0))}
        </p>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-56 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={2}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs">{value}</span>} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
