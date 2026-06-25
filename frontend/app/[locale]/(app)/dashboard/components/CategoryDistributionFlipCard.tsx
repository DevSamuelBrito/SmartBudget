"use client";

// React
import { useState } from "react";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { Cell, Legend, Pie, PieChart } from "recharts";

import { BarChart3, PieChartIcon } from "lucide-react";

// Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

import { EmptyState } from "./EmptyState";

// Types
import type { DashboardCategoryExpense } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type CategoryDistributionFlipCardProps = {
    pieData: DashboardCategoryExpense[];
    categoryExpenses: DashboardCategoryExpense[];
};

const PIE_COLORS = [
    "#8b5cf6",
    "#0ea5e9",
    "#10b981",
    "#f97316",
    "#f43f5e",
    "#f59e0b",
    "#14b8a6",
    "#6366f1",
];

function buildCategoryColors(total: number) {
    if (total <= 0) {
        return [] as string[];
    }

    return Array.from({ length: total }, (_, index) => {
        if (index < PIE_COLORS.length) {
            return PIE_COLORS[index];
        }

        const hue = Math.round((360 / total) * index);

        return `hsl(${hue} 72% 52%)`;
    });
}

export function CategoryDistributionFlipCard({
    pieData,
    categoryExpenses,
}: Readonly<CategoryDistributionFlipCardProps>) {
    const t = useTranslations("dashboard");

    const [showBarView, setShowBarView] = useState(false);
    const isEmpty = pieData.length === 0 && categoryExpenses.length === 0;
    const dynamicColors = buildCategoryColors(Math.max(pieData.length, categoryExpenses.length));

    const getColor = (index: number) => {
        return dynamicColors[index] ?? "#0ea5e9";
    };

    const chartConfig = pieData.reduce<ChartConfig>((acc, item, index) => {
        const key = item.transactionCategoryId ?? `uncategorized-${index}`;

        acc[key] = {
            label: item.categoryName,
            color: getColor(index),
        };

        return acc;
    }, {});

    const chartData = pieData.map((item, index) => ({
        name: item.categoryName,
        value: item.amount,
        fill: getColor(index),
    }));

    if (isEmpty) {
        return (
            <Card className="border-border/70 bg-card/90 backdrop-blur">
                <CardHeader>
                    <CardTitle>{t("charts.categoryDistribution.title")}</CardTitle>
                    <CardDescription>{t("charts.categoryDistribution.pieDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={PieChartIcon}
                        title={t("emptyState.title")}
                        description={t("charts.categoryDistribution.emptyState")}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="perspective-[1400px]">
            <div
                className={`relative h-107.5 w-full transition-transform duration-700 transform-3d ${showBarView ? "transform-[rotateY(180deg)]" : ""
                    }`}
            >
                <Card className="absolute inset-0 border-border/70 bg-card/90 backdrop-blur backface-hidden">
                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle>{t("charts.categoryDistribution.title")}</CardTitle>
                            <CardDescription>{t("charts.categoryDistribution.pieDescription")}</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={t("charts.categoryDistribution.pieToggleLabel")}
                            onClick={() => setShowBarView(true)}
                        >
                            <BarChart3 className="size-4" />
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <ChartContainer config={chartConfig} className="aspect-square h-75 w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={64}
                                    outerRadius={108}
                                    paddingAngle={2}
                                >
                                    {chartData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="absolute inset-0 border-border/70 bg-card/90 backdrop-blur transform-[rotateY(180deg)] backface-hidden">
                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle>{t("charts.categoryDistribution.listTitle")}</CardTitle>
                            <CardDescription>{t("charts.categoryDistribution.listDescription")}</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={t("charts.categoryDistribution.listToggleLabel")}
                            onClick={() => setShowBarView(false)}
                        >
                            <PieChartIcon className="size-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4 overflow-y-auto pb-6">
                        {categoryExpenses.length === 0 && (
                            <p className="text-sm text-muted-foreground">{t("charts.categoryDistribution.empty")}</p>
                        )}

                        {categoryExpenses.map((category, index) => (
                            <div key={category.transactionCategoryId ?? `uncategorized-${index}`} className="space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="size-2.5 rounded-full"
                                            style={{ backgroundColor: getColor(index) }}
                                        />
                                        <span className="font-medium">{category.categoryName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground tabular-nums">
                                            {formatCurrency(category.amount)}
                                        </span>
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                            ({category.percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>
                                <Progress
                                    value={category.percentage}
                                    indicatorStyle={{ backgroundColor: getColor(index) }}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
