'use client';

// react
import { useState } from "react";

// libs
import { Plus, Search } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { TransactionFormSheet } from "./TransactionFormSheet";

import { DeleteTransactionSheet } from "./DeleteTransaction";

import TransactionTable from "./TransactionTable";

// hooks
import { useTransactions } from "../hooks/useTransactions";

// types
import type { TransactionApi } from "../types";

type TransactionsScreenProps = {
    initialTransactions: TransactionApi[];
};

const TransactionsScreen = ({ initialTransactions }: TransactionsScreenProps) => {
    const {
        transactions,
        categories,
        handleCreateTransaction,
        handleUpdateTransaction,
        handleDeleteTransaction,
        isCreatingTransaction,
        isUpdatingTransaction,
        isDeletingTransaction,
        search,
        setSearch,
    } = useTransactions(
        {
            initialTransactions,
            onCloseCreate: () => setCreateOpen(false),
            onCloseEdit: () => setEditingTransaction(null),
            onCloseDelete: () => setDeletingTransaction(null),
        }
    );

    const [createOpen, setCreateOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionApi | null>(null);
    const [deletingTransaction, setDeletingTransaction] = useState<TransactionApi | null>(null);
    const editingOpen = Boolean(editingTransaction);
    const deletingOpen = Boolean(deletingTransaction);

    function closeEditingSheet(open: boolean) {
        if (!open) {
            setEditingTransaction(null);
        }
    }

    function closeDeletingSheet(open: boolean) {
        if (!open) {
            setDeletingTransaction(null);
        }
    }

    function handleEditTransaction(values: Parameters<typeof handleCreateTransaction>[0]) {
        if (!editingTransaction) {
            return;
        }

        handleUpdateTransaction({
            id: editingTransaction.id,
            ...values,
        });
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar transação por descrição"
                        className="pl-8"
                    />
                </div>

                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="size-4" />
                    Adicionar nova Transação
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">
                    <TransactionTable
                        transactions={transactions}
                        onEdit={setEditingTransaction}
                        onDelete={setDeletingTransaction}
                    />
                </CardContent>
            </Card>

            <TransactionFormSheet
                open={createOpen}
                mode="create"
                categories={categories}
                onOpenChange={setCreateOpen}
                onSubmit={handleCreateTransaction}
                isSubmitting={isCreatingTransaction}
            />

            <TransactionFormSheet
                open={editingOpen}
                mode="edit"
                categories={categories}
                transaction={editingTransaction ?? undefined}
                onOpenChange={closeEditingSheet}
                onSubmit={handleEditTransaction}
                isSubmitting={isUpdatingTransaction}
            />

            <DeleteTransactionSheet
                transaction={deletingTransaction ?? undefined}
                open={deletingOpen}
                onOpenChange={closeDeletingSheet}
                isDeleting={isDeletingTransaction}
                onSubmit={() => {
                    if (!deletingTransaction) {
                        return;
                    }

                    handleDeleteTransaction(deletingTransaction.id);
                }}
            />
        </div>
    );
}

export default TransactionsScreen;