"use client";

// next-intl
import { useTranslations } from "next-intl";

// recharts
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// lucide-react
import { PiggyBank } from "lucide-react";

// components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { EmptyState } from "./EmptyState";

// types
import type { DashboardSavingsRate } from "../types";

// utils
import { formatCurrency } from "@/lib/utils/formatters";

type SavingsRateCardProps = {
    data: DashboardSavingsRate | null;
};

type StatusKey = "great" | "ok" | "low";

function getStatusKey(status: DashboardSavingsRate["status"]): StatusKey {
    if (status === "Great") return "great";
    if (status === "Ok") return "ok";
    
    return "low";
}

function getStatusColor(status: DashboardSavingsRate["status"]) {
    if (status === "Great") return "var(--color-emerald-500, #10b981)";
    if (status === "Ok") return "var(--color-amber-500, #f59e0b)";

    return "var(--color-rose-500, #f43f5e)";
}

function getStatusBadgeClass(status: DashboardSavingsRate["status"]) {
    if (status === "Great") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (status === "Ok") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
}

const chartConfig = {
    rate: { label: "Taxa" },
} satisfies ChartConfig;

export function SavingsRateCard({ data }: Readonly<SavingsRateCardProps>) {
    const t = useTranslations("dashboard");

    const isEmpty = data === null || data.rate === 0 && data.savedAmount === 0;
    const rateValue = data ? Math.max(0, Math.min(data.rate, 100)) : 0;
    const chartData = [{ rate: rateValue }];
    const color = data ? getStatusColor(data.status) : "var(--color-muted-foreground)";

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-1">
                <CardTitle>{t("charts.savingsRate.title")}</CardTitle>
                <CardDescription>{t("charts.savingsRate.description")}</CardDescription>
            </CardHeader>
            <CardContent>
                {isEmpty ? (
                    <EmptyState
                        icon={PiggyBank}
                        title={t("emptyState.title")}
                        description={t("charts.savingsRate.emptyState")}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <ChartContainer config={chartConfig} className="h-44 w-44">
                                <RadialBarChart
                                    data={chartData}
                                    startAngle={90}
                                    endAngle={-270}
                                    innerRadius={60}
                                    outerRadius={80}
                                >
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0, 100]}
                                        tick={false}
                                        axisLine={false}
                                    />
                                    <RadialBar
                                        dataKey="rate"
                                        background={{ fill: "var(--color-muted, #e5e7eb)" }}
                                        fill={color}
                                        cornerRadius={8}
                                    />
                                </RadialBarChart>
                            </ChartContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                                <span className="text-2xl font-bold tabular-nums">
                                    {data!.rate.toFixed(1).replace(".", ",")}%
                                </span>
                                <span className="text-xs text-muted-foreground">{t("charts.savingsRate.rateLabel")}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <p className="text-lg font-semibold tabular-nums">
                                {formatCurrency(data!.savedAmount)}
                            </p>
                            <p className="text-xs text-muted-foreground">{t("charts.savingsRate.savedAmount")}</p>
                            <Badge variant="outline" className={getStatusBadgeClass(data!.status)}>
                                {t(`charts.savingsRate.status.${getStatusKey(data!.status)}`)}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
