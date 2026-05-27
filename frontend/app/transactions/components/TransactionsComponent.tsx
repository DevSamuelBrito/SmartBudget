'use client';

//icons
import { Plus, Search } from "lucide-react";

//types
import type { TransactionApi } from "../types";

//hooks
import { useTransitions } from "../hooks/useTransactions";

//components
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import TransactionTable from "./TransactionTable";

type TransactionsScreenProps = {
    initialTransactions: TransactionApi[];
};

const TransactionsScreen = ({ initialTransactions }: TransactionsScreenProps) => {

    const { transactions } = useTransitions(
        {
            initialTransactions,
        }
    );


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar Transação por nome"
                        className="pl-8"
                    />
                </div>

                <Button onClick={() => { }}>
                    <Plus className="size-4" />
                    Adicionar nova Transação
                </Button>
            </div>

            <Card>
                <CardContent>
                    <TransactionTable transactions={transactions} />
                </CardContent>
            </Card>
        </div>
    );
}

export default TransactionsScreen;