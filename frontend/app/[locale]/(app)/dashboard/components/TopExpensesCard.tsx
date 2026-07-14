"use client";

// next-intl
import { useTranslations } from "next-intl";

// recharts
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

// lucide-react
import { Receipt } from "lucide-react";

// components
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

// types
import type { DashboardTopExpense } from "../types";

// utils
import { formatCurrency } from "@/lib/utils/formatters";

type TopExpensesCardProps = {
    data: DashboardTopExpense[] | null;
};

const COLORS = [
    "var(--color-rose-500, #f43f5e)",
    "var(--color-orange-500, #f97316)",
    "var(--color-amber-500, #f59e0b)",
    "var(--color-yellow-500, #eab308)",
    "var(--color-lime-500, #84cc16)",
];

const chartConfig = {
    amount: { label: "Valor" },
} satisfies ChartConfig;

export function TopExpensesCard({ data }: Readonly<TopExpensesCardProps>) {
    const t = useTranslations("dashboard");

    const isEmpty = !data || data.length === 0;

    const chartData = (data ?? []).map((item, index) => ({
        name: item.categoryName ?? item.description,
        description: item.description,
        amount: item.amount,
        colorIndex: index,
    }));

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>{t("charts.topExpenses.title")}</CardTitle>
                <CardDescription>{t("charts.topExpenses.description")}</CardDescription>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <EmptyState
                        icon={Receipt}
                        title={t("emptyState.title")}
                        description={t("charts.topExpenses.emptyState")}
                    />
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 8, right: 48 }}
                        >
                            <XAxis
                                type="number"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) =>
                                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                                }
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                width={90}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(_label, payload) => {
                                            const item = payload?.[0]?.payload as typeof chartData[0] | undefined;

                                            return item?.description ?? _label;
                                        }}
                                        formatter={(value) => formatCurrency(Number(value))}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`${index}-${entry.description}`}
                                        fill={COLORS[entry.colorIndex % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
