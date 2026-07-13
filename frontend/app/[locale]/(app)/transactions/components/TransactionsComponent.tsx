'use client';

// react
import { useState } from "react";

// react-query / react-hook-form / zod / [lib]
import { motion, useReducedMotion } from "framer-motion";

// i18n
import { useTranslations } from "next-intl";

// icons
import { Plus } from "lucide-react";

// components
import { Button } from "@/components/ui/button";


import { Card, CardContent } from "@/components/ui/card";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { TransactionFiltersBar } from "./TransactionFiltersBar";

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
        pendingFilters,
        setPendingFilters,
        hasActiveFilters,
        handleSearch,
        handleClearFilters,
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
        if (!open) setEditingTransaction(null);
    }

    function closeDeletingSheet(open: boolean) {
        if (!open) setDeletingTransaction(null);
    }

    function handleEditTransaction(values: Parameters<typeof handleCreateTransaction>[0]) {
        if (!editingTransaction) return;
        handleUpdateTransaction({ id: editingTransaction.id, ...values });
    }

    const t = useTranslations("transactions");
    const shouldReduceMotion = useReducedMotion();

    const pageCount = Math.max(1, totalPages);
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    function handlePageChange(nextPage: number) {
        if (nextPage < 1 || nextPage > pageCount || nextPage === page) return;
        setPage(nextPage);
    }

    return (
        <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col gap-4 p-4 lg:p-6"
        >
            <div className="flex flex-wrap items-end justify-between gap-3">
                <TransactionFiltersBar
                    pendingFilters={pendingFilters}
                    setPendingFilters={setPendingFilters}
                    categories={categories}
                    hasActiveFilters={hasActiveFilters}
                    onSearch={handleSearch}
                    onClearFilters={handleClearFilters}
                />

                <div className="flex items-center gap-2">
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="size-4" />
                        {t("createButton")}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-4">
                    <TransactionTable
                        transactions={transactions}
                        onEdit={setEditingTransaction}
                        onDelete={setDeletingTransaction}
                    />

                    {totalPages > 1 && (
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
                    )}
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
                    if (!deletingTransaction) return;
                    handleDeleteTransaction(deletingTransaction.id);
                }}
            />
        </motion.div>
    );
}

export default TransactionsScreen;
