"use client";

// next-intl
import { useTranslations } from "next-intl";

// lucide-react
import { HeartPulse, Target } from "lucide-react";

// components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";

// types
import type { DashboardBudgetHealth } from "../types";

type BudgetHealthCardProps = {
    data: DashboardBudgetHealth | null;
};

type StatusKey = "healthy" | "moderate" | "atRisk";

function getStatusKey(status: DashboardBudgetHealth["status"]): StatusKey {
    if (status === "Healthy") return "healthy";
    if (status === "Moderate") return "moderate";

    return "atRisk";
}

function getStatusStyles(status: DashboardBudgetHealth["status"]) {
    if (status === "Healthy") return {
        score: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
    
    if (status === "Moderate") return {
        score: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };

    return {
        score: "text-rose-600 dark:text-rose-400",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
}

export function BudgetHealthCard({ data }: Readonly<BudgetHealthCardProps>) {
    const t = useTranslations("dashboard");

    const hasNoBudgets = !data || (data.okCount === 0 && data.warningCount === 0 && data.exceededCount === 0);

    if (hasNoBudgets) {
        return (
            <Card className="border-border/70 bg-card/90 backdrop-blur">
                <CardHeader className="space-y-1">
                    <CardTitle>{t("charts.budgetHealth.title")}</CardTitle>
                    <CardDescription>{t("charts.budgetHealth.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={Target}
                        title={t("emptyState.title")}
                        description={t("charts.budgetHealth.emptyState")}
                    />
                </CardContent>
            </Card>
        );
    }

    const styles = getStatusStyles(data.status);
    const statusKey = getStatusKey(data.status);
    const scoreLabel = data.score.toFixed(0);

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle>{t("charts.budgetHealth.title")}</CardTitle>
                        <CardDescription>{t("charts.budgetHealth.description")}</CardDescription>
                    </div>
                    <div className={`rounded-full border border-border/60 p-2 ${styles.badge}`}>
                        <HeartPulse className="size-4" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="flex items-end gap-3">
                    <span className={`text-5xl font-bold tabular-nums ${styles.score}`}>
                        {scoreLabel}
                    </span>
                    <span className="mb-1 text-lg text-muted-foreground">/100</span>
                    <div className="mb-1 ml-auto">
                        <Badge variant="outline" className={styles.badge}>
                            {t(`charts.budgetHealth.status.${statusKey}`)}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {data.okCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{t("charts.budgetHealth.ok")}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                            {data.warningCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{t("charts.budgetHealth.warning")}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                            {data.exceededCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{t("charts.budgetHealth.exceeded")}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
