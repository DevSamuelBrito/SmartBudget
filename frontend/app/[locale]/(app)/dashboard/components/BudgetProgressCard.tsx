"use client";

//next
import { useRouter } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

//lucide-react
import { ExternalLink } from "lucide-react";

// Components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";

// Types
import type { DashboardBudgetProgress } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type BudgetProgressCardProps = {
    budgets: DashboardBudgetProgress[];
};

function getStatusColor(status: DashboardBudgetProgress["status"], percentage: number) {
    if (status === "Exceeded" || status === 3 || percentage >= 100) {
        return "bg-rose-500";
    }

    if (status === "Warning" || status === 2 || percentage >= 80) {
        return "bg-amber-500";
    }

    return "bg-emerald-500";
}

export function BudgetProgressCard({ budgets }: BudgetProgressCardProps) {
    const t = useTranslations("dashboard");

    const router = useRouter();

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>{t("charts.budgetProgress.title")}</CardTitle>
                <CardDescription>{t("charts.budgetProgress.description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {budgets.length === 0 && (
                    <p className="text-sm text-muted-foreground">{t("charts.budgetProgress.empty")}</p>
                )}

                {budgets.map((budget) => (
                    <div key={budget.budgetId} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{budget.categoryName}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.limitAmount)}
                            </span>
                        </div>
                        <Progress
                            value={Math.min(budget.percentage, 100)}
                            indicatorClassName={getStatusColor(budget.status, budget.percentage)}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {t("charts.budgetProgress.used", { percentage: budget.percentage.toFixed(0) })}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {t("charts.budgetProgress.remaining", {
                                    amount: formatCurrency(Math.max(budget.remainingAmount, 0)),
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>

                <Button variant="outline" className="w-full" onClick={() => router.push("/transactions")}>
                    {t("charts.budgetProgress.manageCategories")}
                    <ExternalLink className="size-4" />
                </Button>

            </CardFooter>
        </Card>
    );
}
