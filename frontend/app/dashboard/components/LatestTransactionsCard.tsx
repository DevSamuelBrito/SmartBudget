"use client";

//next
import { useRouter } from "next/navigation";

// Libs
import { ExternalLink } from "lucide-react";

// Components
import { Badge } from "@/components/ui/badge";

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

// Types
import type { DashboardLatestTransaction } from "../types";

// Utils
import { formatCurrency, formatDate } from "@/lib/utils/formatters";


type LatestTransactionsCardProps = {
    transactions: DashboardLatestTransaction[];
};

export function LatestTransactionsCard({ transactions }: LatestTransactionsCardProps) {

    const router = useRouter();


    const getTypeLabel = (type: 1 | 2 | 3) => {
        if (type === 1) return "Receita";
        if (type === 2) return "Despesa";
        return "Transferência";
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
                    <CardTitle>Últimas transações</CardTitle>
                    <CardDescription>Lançamentos mais recentes por Data</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {transactions.slice(0, 8).map((transaction, index) => (
                    <div key={transaction.id}>
                        <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate font-medium leading-none">
                                        {transaction.description}
                                    </p>
                                    {transaction.categoryName && (
                                        <Badge variant="secondary" className="rounded-full">
                                            {transaction.categoryName}
                                        </Badge>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(transaction.transactionDate)} · {getTypeLabel(transaction.type)}
                                </p>
                            </div>

                            <span className={`whitespace-nowrap text-sm font-medium tabular-nums ${getAmountColor(transaction.type)}`}>
                                {getSignedAmount(transaction.amount, transaction.type)}
                            </span>
                        </div>

                        {index < transactions.slice(0, 8).length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
            </CardContent>

            {transactions.length === 0 ? (
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        Nenhuma transação encontrada.
                    </p>
                </CardFooter>
            ) : (
                <CardFooter className="justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                        Mostrando as últimas {transactions.length} transações.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
                        Ver tudo
                        <ExternalLink className="size-4" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
