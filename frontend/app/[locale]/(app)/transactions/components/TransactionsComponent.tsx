'use client';

// react
import { useState } from "react";

// i18n
import { useTranslations } from "next-intl";

// libs
import { Plus, Search } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { TransactionFormSheet } from "./TransactionFormSheet";

import { DeleteTransactionSheet } from "./DeleteTransaction";

import TransactionTable from "./TransactionTable";

// hooks
import { useTransactions } from "../hooks/useTransactions";

// types
import type { PagedResult } from "@/types/pagination";

import type { TransactionApi, TransactionWithCategory } from "../types";

type TransactionsScreenProps = {
    initialTransactions: PagedResult<TransactionApi>;
};

const TransactionsScreen = ({ initialTransactions }: TransactionsScreenProps) => {
    const {
        transactions,
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
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
    const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
    const [deletingTransaction, setDeletingTransaction] = useState<TransactionWithCategory | null>(null);
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

    const t = useTranslations("transactions");

    const pageCount = Math.max(1, totalPages);

    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    function handlePageChange(nextPage: number) {
        if (nextPage < 1 || nextPage > pageCount || nextPage === page) {
            return;
        }

        setPage(nextPage);
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="pl-8"
                    />
                </div>

                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="size-4" />
                    {t("createButton")}
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">
                    <TransactionTable
                        transactions={transactions}
                        onEdit={setEditingTransaction}
                        onDelete={setDeletingTransaction}
                    />

                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    text={t("pagination.previous")}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handlePageChange(page - 1);
                                    }}
                                    aria-disabled={!hasPreviousPage}
                                    className={hasPreviousPage ? undefined : "pointer-events-none opacity-50"}
                                />
                            </PaginationItem>

                            {pages.map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        isActive={pageNumber === page}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handlePageChange(pageNumber);
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    text={t("pagination.next")}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handlePageChange(page + 1);
                                    }}
                                    aria-disabled={!hasNextPage}
                                    className={hasNextPage ? undefined : "pointer-events-none opacity-50"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
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