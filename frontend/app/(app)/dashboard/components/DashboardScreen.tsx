"use client";

// React
import type { ReactNode } from "react";

// Components
import { KpiCards } from "./KpiCards";

import { LatestTransactionsCard } from "./LatestTransactionsCard";

import { IncomeExpenseBarChart } from "./IncomeExpenseBarChart";

import { CategoryDistributionFlipCard } from "./CategoryDistributionFlipCard";

import { BalanceEvolutionChart } from "./BalanceEvolutionChart";

import { BudgetProgressCard } from "./BudgetProgressCard";

import { AlertsCard } from "./AlertsCard";

import { QuickInsightsCard } from "./QuickInsightsCard";

// Hooks
import { useDashboardConfig } from "../hooks/useDashboardConfig";

import { useAuth } from "@/contexts/auth-context";

// Types
import type { DashboardOverviewApi, DashboardConfigItem } from "../types";

type DashboardScreenProps = {
    data: DashboardOverviewApi;
    initialConfig: DashboardConfigItem[];
};

export function DashboardScreen({ data, initialConfig }: DashboardScreenProps) {
    
    const { state } = useAuth();
    const userId = state.user?.userId;
    const { data: config } = useDashboardConfig(initialConfig, userId);

    const componentMap: Record<string, ReactNode> = {
        alertsCard: <AlertsCard alerts={data.alerts} />,
        quickInsightsCard: (
            <QuickInsightsCard
                dailyAverageIncome={data.dailyAverageIncome}
                dailyAverageExpense={data.dailyAverageExpense}
            />
        ),
        latestTransactionsCard: (
            <LatestTransactionsCard transactions={data.latestTransactions} />
        ),
        budgetProgressCard: <BudgetProgressCard budgets={data.budgetProgress} />,
        balanceEvolutionChart: <BalanceEvolutionChart data={data.balanceEvolution} />,
        incomeExpenseBarChart: (
            <IncomeExpenseBarChart data={data.incomeVsExpenseByMonth} />
        ),
        categoryDistributionFlipCard: (
            <CategoryDistributionFlipCard
                pieData={data.categoryExpensePie}
                categoryExpenses={data.categoryExpenses}
            />
        ),
    };

    const visibleItems = (config ?? [])
        .filter((item) => item.visible)
        .sort((a, b) => a.order - b.order);

    return (
        <div className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_32%)]" />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">

                {/* KPI Cards */}
                <KpiCards kpis={data.kpis} />

                {/* Dynamic components based on user config */}
                <section className="grid gap-4 xl:grid-cols-2">
                    {visibleItems.map((item) => {
                        const component = componentMap[item.componentKey];
                        if (!component) return null;

                        return (
                            <div
                                key={item.componentKey}
                                className={item.columns === 2 ? "xl:col-span-2" : "xl:col-span-1"}
                            >
                                {component}
                            </div>
                        );
                    })}
                </section>

            </div>
        </div>
    );
}
