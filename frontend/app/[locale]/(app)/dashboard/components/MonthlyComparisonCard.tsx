"use client";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { TrendingUp, TrendingDown, Minus, GitCompare } from "lucide-react";

// components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// types
import type { DashboardMonthlyComparison } from "../types";

// utils
import { formatCurrency } from "@/lib/utils/formatters";

type MonthlyComparisonCardProps = {
    data: DashboardMonthlyComparison | null;
};

type VariationConfig = {
    value: number;
    isPositive: boolean;
};

function getVariationConfig(variation: number, isIncome: boolean): VariationConfig {
    const isPositive = isIncome ? variation >= 0 : variation <= 0;
    
    return { value: variation, isPositive };
}

function VariationIndicator({ variation, isPositive }: Readonly<{ variation: number; isPositive: boolean }>) {
    const absValue = Math.abs(variation);
    const label = `${absValue.toFixed(1).replace(".", ",")}%`;

    if (absValue < 0.01) {
        return (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Minus className="size-3" />
                {label}
            </span>
        );
    }

    return (
        <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {variation > 0
                ? <TrendingUp className="size-3" />
                : <TrendingDown className="size-3" />
            }
            {label}
        </span>
    );
}

export function MonthlyComparisonCard({ data }: Readonly<MonthlyComparisonCardProps>) {
    const t = useTranslations("dashboard");

    const rows: Array<{
        labelKey: string;
        current: number;
        previous: number;
        variation: number;
        isIncome: boolean;
    }> = data
        ? [
            {
                labelKey: "income",
                current: data.previousMonthIncome + (data.previousMonthIncome * data.incomeVariation) / 100,
                previous: data.previousMonthIncome,
                variation: data.incomeVariation,
                isIncome: true,
            },
            {
                labelKey: "expense",
                current: data.previousMonthExpense + (data.previousMonthExpense * data.expenseVariation) / 100,
                previous: data.previousMonthExpense,
                variation: data.expenseVariation,
                isIncome: false,
            },
            {
                labelKey: "balance",
                current: data.previousMonthBalance + (Math.abs(data.previousMonthBalance) * data.balanceVariation) / 100,
                previous: data.previousMonthBalance,
                variation: data.balanceVariation,
                isIncome: true,
            },
        ]
        : [];

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-1">
                <CardTitle>{t("charts.monthlyComparison.title")}</CardTitle>
                <CardDescription>{t("charts.monthlyComparison.description")}</CardDescription>
            </CardHeader>
            <CardContent>
                {!data ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                        <div className="rounded-full bg-muted p-4 text-muted-foreground">
                            <GitCompare className="size-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">{t("emptyState.title")}</p>
                            <p className="text-sm text-muted-foreground">{t("charts.monthlyComparison.emptyState")}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="grid grid-cols-3 gap-2 pb-2 text-xs text-muted-foreground">
                            <span>{t("charts.monthlyComparison.metric")}</span>
                            <span className="text-right">{t("charts.monthlyComparison.previous")}</span>
                            <span className="text-right">{t("charts.monthlyComparison.variation")}</span>
                        </div>

                        {rows.map((row) => {
                            const { isPositive } = getVariationConfig(row.variation, row.isIncome);
                            
                            return (
                                <div
                                    key={row.labelKey}
                                    className="grid grid-cols-3 items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-3"
                                >
                                    <span className="text-sm font-medium">
                                        {t(`charts.monthlyComparison.${row.labelKey}`)}
                                    </span>
                                    <span className="text-right text-sm tabular-nums text-muted-foreground">
                                        {formatCurrency(row.previous)}
                                    </span>
                                    <div className="flex justify-end">
                                        <VariationIndicator variation={row.variation} isPositive={isPositive} />
                                    </div>
                                </div>
                            );
                        })}

                        <p className="pt-2 text-xs text-muted-foreground">
                            {t("charts.monthlyComparison.footer")}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
