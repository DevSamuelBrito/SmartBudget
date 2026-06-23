"use client";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { ShieldAlert } from "lucide-react";

// Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

// Types
import type { DashboardFinancialRisk } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type FinancialRiskCardProps = {
    financialRisk: DashboardFinancialRisk;
};

type NormalizedFinancialRiskStatus = "Ok" | "Warning" | "Risk" | "NoData";

function normalizeStatus(status: DashboardFinancialRisk["status"]): NormalizedFinancialRiskStatus {
    if (status === "NoData") {
        return "NoData";
    }

    if (status === "Warning") {
        return "Warning";
    }

    if (status === "Risk" || status === "FinancialRisk") {
        return "Risk";
    }

    return "Ok";
}

function getStatusStyles(status: NormalizedFinancialRiskStatus) {
    switch (status) {
        case "Warning":
            return {
                bar: "bg-amber-500",
                badge: "bg-amber-500/10 text-amber-500",
            };
        case "Risk":
            return {
                bar: "bg-rose-500",
                badge: "bg-rose-500/10 text-rose-500",
            };
        case "NoData":
            return {
                bar: "bg-muted-foreground/30",
                badge: "bg-muted/60 text-muted-foreground",
            };
        case "Ok":
        default:
            return {
                bar: "bg-emerald-500",
                badge: "bg-emerald-500/10 text-emerald-500",
            };
    }
}

function getStatusMessage(
    t: ReturnType<typeof useTranslations>,
    status: NormalizedFinancialRiskStatus,
    percentageLabel: string,
) {
    switch (status) {
        case "Warning":
            return t("charts.financialRisk.warningMessage");
        case "Risk":
            return t("charts.financialRisk.riskMessage", { percentageLabel });
        case "NoData":
            return t("charts.financialRisk.noDataMessage");
        case "Ok":
        default:
            return t("charts.financialRisk.okMessage");
    }
}

export function FinancialRiskCard({ financialRisk }: Readonly<FinancialRiskCardProps>) {
    const t = useTranslations("dashboard");

    const status = normalizeStatus(financialRisk.status);
    const styles = getStatusStyles(status);
    const percentageValue = Number.isFinite(financialRisk.percentage) ? financialRisk.percentage : 0;
    const percentageLabel = `${percentageValue.toFixed(1).replace(".", ",")}%`;
    const progressValue = status === "NoData" ? 0 : Math.min(percentageValue, 100);

    const statusKey =
        status === "NoData"
            ? "noData"
            : status === "Warning"
                ? "warning"
                : status === "Risk"
                    ? "risk"
                    : "ok";

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle>{t("charts.financialRisk.title")}</CardTitle>
                        <CardDescription>{t("charts.financialRisk.description")}</CardDescription>
                    </div>

                    <div className={`rounded-full border border-border/60 p-2 ${styles.badge}`}>
                        <ShieldAlert className="size-4" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-end justify-between gap-3">
                        <p className="text-3xl font-semibold tabular-nums">{percentageLabel}</p>
                        <span className="rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t(`charts.financialRisk.status.${statusKey}`)}
                        </span>
                    </div>

                    <Progress value={progressValue} indicatorClassName={styles.bar} />
                </div>

                <p className="text-sm text-muted-foreground">{getStatusMessage(t, status, percentageLabel)}</p>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("charts.financialRisk.averageIncome")}</p>
                    <p className="mt-2 text-lg font-semibold tabular-nums">{formatCurrency(financialRisk.averageIncome)}</p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("charts.financialRisk.fixedExpenses")}</p>
                    <p className="mt-2 text-lg font-semibold tabular-nums">{formatCurrency(financialRisk.fixedExpenses)}</p>
                </div>
            </CardContent>
        </Card>
    );
}