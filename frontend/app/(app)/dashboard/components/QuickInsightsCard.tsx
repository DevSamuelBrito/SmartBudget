"use client";

// Libs
import { BadgeDollarSign, TrendingDown, TrendingUp } from "lucide-react";

// Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Utils
import { formatCurrency } from "@/lib/utils/formatters";

type QuickInsightsCardProps = {
    dailyAverageIncome: number;
    dailyAverageExpense: number;
};

export function QuickInsightsCard({ dailyAverageIncome, dailyAverageExpense }: QuickInsightsCardProps) {
    return (
        <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardHeader>
                <CardTitle>Indicadores rápidos</CardTitle>
                <CardDescription>Médias diárias do mês</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500">
                            <TrendingUp className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Média diária de ganho</p>
                            <p className="text-lg font-semibold tabular-nums">
                                {formatCurrency(dailyAverageIncome)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 p-2 text-orange-500">
                            <TrendingDown className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Média diária de gasto</p>
                            <p className="text-lg font-semibold tabular-nums">
                                {formatCurrency(dailyAverageExpense)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <BadgeDollarSign className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Saldo diário líquido</p>
                            <p className="text-lg font-semibold tabular-nums">
                                {formatCurrency(dailyAverageIncome - dailyAverageExpense)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
