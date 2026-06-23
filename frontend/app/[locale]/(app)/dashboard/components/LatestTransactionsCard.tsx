"use client";

//next
import { useRouter } from "next/navigation";

// next-intl
import { useTranslations } from "next-intl";

// Libs
import { CircleHelp, ExternalLink } from "lucide-react";

// Components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";

import { ThemeIcon, iconMap, type ThemeIconKey } from "@/app/[locale]/(app)/categories/components/theme-icons";

//constants
import { ICONT_THEME } from "@/app/[locale]/(app)/categories/constants/icons-theme";

// Types
import type { DashboardLatestTransaction } from "../types";

// Utils
import { formatCurrency, formatDate } from "@/lib/utils/formatters";


type LatestTransactionsCardProps = {
    transactions: DashboardLatestTransaction[];
};

export function LatestTransactionsCard({ transactions }: Readonly<LatestTransactionsCardProps>) {
    const t = useTranslations("dashboard");

    const router = useRouter();

    const visibleTransactions = transactions.slice(0, 8);

    const isThemeIconKey = (iconKey: string | null): iconKey is ThemeIconKey => {
        return Boolean(iconKey && iconKey in iconMap);
    };

    const getCategoryThemeClass = (iconKey: string | null) => {
        if (!isThemeIconKey(iconKey)) {
            return "bg-muted text-muted-foreground";
        }

        const theme = ICONT_THEME.find((item) => item.iconKey === iconKey);

        return theme ? `${theme.colorClass} text-white` : "bg-muted text-muted-foreground";
    };

    const getAmountColor = (type: 1 | 2 | 3) => {
        if (type === 1) return "text-emerald-500";
        if (type === 2) return "text-orange-500";

        return "text-sky-500";
    };

    const getSignedAmount = (amount: number, type: 1 | 2 | 3) => {
        if (type === 1) return `+${formatCurrency(amount)}`;
        if (type === 2) return `-${formatCurrency(amount)}`;

        return formatCurrency(amount);
    };

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>{t("charts.latestTransactions.title")}</CardTitle>
                    <CardDescription>{t("charts.latestTransactions.description")}</CardDescription>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            {t("charts.latestTransactions.incomeLegend")}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-orange-500" />
                            {t("charts.latestTransactions.expenseLegend")}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {visibleTransactions.map((transaction, index) => (
                    <div key={transaction.id}>
                        <div className="flex items-center gap-3">
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${getCategoryThemeClass(transaction.categoryIcon)}`}>
                                {isThemeIconKey(transaction.categoryIcon) ? (
                                    <ThemeIcon iconKey={transaction.categoryIcon} className="size-4" />
                                ) : (
                                    <CircleHelp className="size-4" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium leading-none">
                                    {transaction.description}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(transaction.transactionDate)}
                                </p>
                            </div>

                            <span className={`whitespace-nowrap text-sm font-medium tabular-nums ${getAmountColor(transaction.type)}`}>
                                {getSignedAmount(transaction.amount, transaction.type)}
                            </span>
                        </div>

                        {index < visibleTransactions.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </CardContent>

            {transactions.length === 0 ? (
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        {t("charts.latestTransactions.empty")}
                    </p>
                </CardFooter>
            ) : (
                <CardFooter className="justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        {t("charts.latestTransactions.showing", { count: visibleTransactions.length })}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
                        {t("charts.latestTransactions.viewAll")}
                        <ExternalLink className="size-4" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
