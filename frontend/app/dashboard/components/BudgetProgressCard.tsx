"use client";

//next
import { useRouter } from "next/navigation";

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

// Types
import type { DashboardBudgetProgress } from "../types";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus } from "lucide-react";

type BudgetProgressCardProps = {
    budgets: DashboardBudgetProgress[];
};

function getStatusColor(status: DashboardBudgetProgress["status"], percentage: number) {
    if (status === "Exceeded" || status === 3 || percentage >= 100) return "bg-rose-500";
    if (status === "Warning" || status === 2 || percentage >= 80) return "bg-amber-500";
    return "bg-emerald-500";
}

export function BudgetProgressCard({ budgets }: BudgetProgressCardProps) {

    const router = useRouter();

    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>Progresso dos budgets</CardTitle>
                <CardDescription>Orçado x realizado por categoria</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {budgets.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum budget definido para este período.</p>
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
                                {budget.percentage.toFixed(0)}% utilizado
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                                Restam {formatCurrency(Math.max(budget.remainingAmount, 0))}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>

                <Button variant="outline" className="w-full">
                    <Plus className="size-4" />
                    Gerenciar Categorias
                </Button>

                {/* <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
                    Criar Categoria
                    <ExternalLink className="size-4" />
                </Button> */}
            </CardFooter>
        </Card>
    );
}
