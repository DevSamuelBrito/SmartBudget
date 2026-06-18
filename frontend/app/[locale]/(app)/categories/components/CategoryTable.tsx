"use client";

// react
import { useRef } from "react";

// i18n
import { useTranslations } from "next-intl";

import { Pencil, Trash2 } from "lucide-react";

// ui
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// components
import { ThemeIcon } from "./theme-icons";

// types 
import type { BudgetByPeriodApi, CategoryApi, CategoryTheme } from "../types";

// utils
import { formatCurrency } from "@/lib/utils/formatters";

type CategoryTableProps = {
    categories: CategoryApi[];
    onEdit: (category: CategoryApi) => void;
    onDelete: (category: CategoryApi) => void;
    onSetBudget: (category: CategoryApi) => void;
    themes: CategoryTheme[];
    budgetsByCategoryId: Map<string, BudgetByPeriodApi>;
};

export function CategoryTable({
    categories,
    onEdit,
    onDelete,
    onSetBudget,
    themes,
    budgetsByCategoryId,
}: CategoryTableProps) {
    const t = useTranslations("categories");
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);


    function getTheme(iconKey: CategoryApi["icon"]) {
        return themes.find((theme) => theme.iconKey === iconKey);
    }

    function getProgressClassName(status: BudgetByPeriodApi["status"]) {
        if (status === "Exceeded" || status === 3) {
            return "bg-red-500";
        }

        if (status === "Warning" || status === 2) {
            return "bg-amber-500";
        }

        return "bg-emerald-500";
    }

    const renderTableBody = () => {
        return categories.map((category) => {
            const theme = getTheme(category.icon);
            const budget = budgetsByCategoryId.get(category.id);
            const remainingAmount = budget ? budget.limitAmount - budget.spentAmount : null;

            return (
                <TableRow key={category.id}>
                    <TableCell>
                        {theme ? (
                            <div
                                className={`flex size-8 items-center justify-center rounded-md text-white ${theme.colorClass}`}
                            >
                                <ThemeIcon iconKey={theme.iconKey} className="size-4" />
                            </div>
                        ) : (
                            <div className="size-8 rounded-md bg-muted" />
                        )}
                    </TableCell>

                    <TableCell>{category.name}</TableCell>

                    <TableCell>
                        {budget ? formatCurrency(budget.limitAmount) : "—"}
                    </TableCell>

                    <TableCell>
                        {budget ? formatCurrency(budget.spentAmount) : "—"}
                    </TableCell>

                    <TableCell>
                        {budget && typeof remainingAmount === "number" ? formatCurrency(remainingAmount) : "—"}
                    </TableCell>

                    <TableCell>
                        {budget ? (
                            <div className="min-w-42.5 space-y-1">
                                <Progress
                                    value={Math.min(100, Math.max(0, budget.percentage))}
                                    className="h-3"
                                    indicatorClassName={getProgressClassName(budget.status)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {budget.percentage.toFixed(1)}%
                                </p>
                            </div>
                        ) : (
                            "—"
                        )}
                    </TableCell>

                    <TableCell>
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onSetBudget(category)}
                                aria-label={t("actions.setBudgetAriaLabel", { name: category.name })}
                            >
                                {t("actions.setBudget")}
                            </Button>

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => onEdit(category)}
                                aria-label={t("actions.editAriaLabel", { name: category.name })}
                            >
                                <Pencil className="size-4" />
                            </Button>

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => onDelete(category)}
                                aria-label={t("actions.deleteAriaLabel", { name: category.name })}
                            >
                                <Trash2 className="size-4 text-destructive" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            );
        });

    }

    return (
        <div className="rounded-xl border">
            <div ref={scrollAreaRef} className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">{t("table.icon")}</TableHead>
                            <TableHead>{t("table.name")}</TableHead>
                            <TableHead>{t("table.budget")}</TableHead>
                            <TableHead>{t("table.spent")}</TableHead>
                            <TableHead>{t("table.remaining")}</TableHead>
                            <TableHead>{t("table.progress")}</TableHead>
                            <TableHead className="w-60">{t("table.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {renderTableBody()}
                    </TableBody>
                </Table>

            </div>
        </div>
    );
}
