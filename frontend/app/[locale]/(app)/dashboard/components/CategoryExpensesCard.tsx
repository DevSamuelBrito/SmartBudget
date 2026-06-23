"use client";

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
import type { DashboardCategoryExpense } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type CategoryExpensesCardProps = {
  categoryExpenses: DashboardCategoryExpense[];
};

const CATEGORY_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-indigo-500",
];

export function CategoryExpensesCard({ categoryExpenses }: Readonly<CategoryExpensesCardProps>) {
  return (
    <Card className="border-border/70 bg-card/90 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle>Gasto por categoria</CardTitle>
        <CardDescription>Distribuição das despesas do mês relacionado ao todo.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {categoryExpenses.length === 0 && (
          <p className="text-sm text-muted-foreground">Sem despesas neste período.</p>
        )}

        {categoryExpenses.map((category, index) => (
          <div key={category.transactionCategoryId ?? "uncategorized"} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}`} />
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
              indicatorClassName={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
