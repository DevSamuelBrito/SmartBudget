"use client";

// next-intl
import { useTranslations } from "next-intl";

// recharts
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

// lucide-react
import { Waves } from "lucide-react";

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
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { EmptyState } from "./EmptyState";

// types
import type { DashboardCashFlow } from "../types";

// utils
import { formatCurrency } from "@/lib/utils/formatters";

type CashFlowChartProps = {
    data: DashboardCashFlow[] | null;
};

export function CashFlowChart({ data }: Readonly<CashFlowChartProps>) {
    const t = useTranslations("dashboard");

    const chartConfig = {
        totalIncome: {
            label: t("charts.cashFlow.income"),
            color: "var(--color-emerald-500, #10b981)",
        },
        totalExpense: {
            label: t("charts.cashFlow.expense"),
            color: "var(--color-rose-500, #f43f5e)",
        },
    } satisfies ChartConfig;

    const isEmpty = !data || data.length === 0 || data.every((w) => w.totalIncome === 0 && w.totalExpense === 0);

    const chartData = (data ?? []).map((week) => ({
        label: `${t("charts.cashFlow.weekLabel")} ${week.weekNumber}`,
        totalIncome: week.totalIncome,
        totalExpense: week.totalExpense,
    }));

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>{t("charts.cashFlow.title")}</CardTitle>
                <CardDescription>{t("charts.cashFlow.description")}</CardDescription>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <EmptyState
                        icon={Waves}
                        title={t("emptyState.title")}
                        description={t("charts.cashFlow.emptyState")}
                    />
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-70 w-full">
                        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
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
                                tickFormatter={(v) =>
                                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                                }
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(label) => label}
                                        formatter={(value) => formatCurrency(Number(value))}
                                        indicator="dot"
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="totalIncome" fill="var(--color-totalIncome)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="totalExpense" fill="var(--color-totalExpense)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
