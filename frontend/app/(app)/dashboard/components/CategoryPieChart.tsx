"use client";

// Libs
import { Pie, PieChart, Cell, Legend } from "recharts";

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
import type { DashboardCategoryExpense } from "../types";

type CategoryPieChartProps = {
    data: DashboardCategoryExpense[];
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

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    const chartConfig = data.reduce<ChartConfig>((acc, item, index) => {
        const key = item.transactionCategoryId ?? `uncategorized-${index}`;

        acc[key] = {
            label: item.categoryName,
            color: PIE_COLORS[index % PIE_COLORS.length],
        };

        return acc;
    }, {});

    const chartData = data.map((item, index) => ({
        name: item.categoryName,
        value: item.amount,
        fill: PIE_COLORS[index % PIE_COLORS.length],
    }));

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>Despesas por categoria</CardTitle>
                <CardDescription>Distribuição em pizza</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-square h-[280px] w-full">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
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
    );
}
