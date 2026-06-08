"use client";

// Components
import { KpiCards } from "./KpiCards";

import { LatestTransactionsCard } from "./LatestTransactionsCard";

import { IncomeExpenseBarChart } from "./IncomeExpenseBarChart";

import { CategoryDistributionFlipCard } from "./CategoryDistributionFlipCard";

import { BalanceEvolutionChart } from "./BalanceEvolutionChart";

import { BudgetProgressCard } from "./BudgetProgressCard";

import { AlertsCard } from "./AlertsCard";

import { QuickInsightsCard } from "./QuickInsightsCard";

// Types
import type { DashboardOverviewApi } from "../types";

type DashboardScreenProps = {
    data: DashboardOverviewApi;
};

export function DashboardScreen({ data }: DashboardScreenProps) {
    return (
        <div className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_32%)]" />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
                
                {/* KPI Cards */}
                <KpiCards kpis={data.kpis} />

                <section className="grid gap-4 xl:grid-cols-12">
                    <div className="xl:col-span-6">
                        {/* Alertas */}
                        <AlertsCard alerts={data.alerts} />

                    </div>
                    <div className="xl:col-span-6">
                        {/* Insights rápidos */}
                        <QuickInsightsCard
                            dailyAverageIncome={data.dailyAverageIncome}
                            dailyAverageExpense={data.dailyAverageExpense}
                        />
                    </div>
                </section>

                {/* Últimas transações + Progresso dos budgets */}
                <section className="grid gap-4 xl:grid-cols-12">
                    <div className="xl:col-span-7">
                        <LatestTransactionsCard transactions={data.latestTransactions} />
                    </div>
                    <div className="xl:col-span-5">
                        <BudgetProgressCard budgets={data.budgetProgress} />
                    </div>
                </section>

                {/* Evolução de saldo - Full width */}
                <section className="grid gap-4 xl:grid-cols-12">
                    <div className="xl:col-span-12">
                        <BalanceEvolutionChart data={data.balanceEvolution} />
                    </div>
                </section>

                {/* Gráfico de barras Receita x Despesa + Despesas por categorias */}
                <section className="grid gap-4 xl:grid-cols-12">
                    <div className="xl:col-span-6">
                        <IncomeExpenseBarChart data={data.incomeVsExpenseByMonth} />
                    </div>
                    <div className="xl:col-span-6">
                        <CategoryDistributionFlipCard
                            pieData={data.categoryExpensePie}
                            categoryExpenses={data.categoryExpenses}
                        />
                    </div>
                </section>
            
            </div>
        </div>
    );
}
