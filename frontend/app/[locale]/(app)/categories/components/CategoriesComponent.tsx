"use client";

// react
import { useState } from "react";

// i18n
import { useTranslations } from "next-intl";

//react query
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

import { MonthYearSelector } from "@/components/shared/month-year-selector";

import { CategoryFormSheet } from "./CategoryForm";

import { CategoryTable } from "./CategoryTable";

import { DeleteCategorySheet } from "./DeleteCategory";

import { BudgetLimitSheet } from "./BudgetLimitSheet";

// hooks
import { useCategories } from "../hooks/useCategories";

//types
import type { PagedResult } from "@/types/pagination";

import type { BudgetByPeriodApi, CategoryApi } from "../types";

type CategoriesScreenProps = {
    initialCategories: PagedResult<CategoryApi>;
    initialBudgets: BudgetByPeriodApi[];
    initialMonth: number;
    initialYear: number;
};

export function CategoriesScreen({
    initialCategories,
    initialBudgets,
    initialMonth,
    initialYear,
}: CategoriesScreenProps) {
    const {
        categories,
        page,
        setPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        selectedPeriod,
        setSelectedPeriod,
        budgetMapByCategoryId,

        iconThemes,

        handleCreateCategory,
        isCreatingCategory,

        handleUpdateCategory,
        isUpdatingCategory,

        isDeletingCategory,

        handleDeleteCategory,
        handleUpsertBudget,
        isSavingBudget,

        search,
        setSearch,
    } = useCategories(
        {
            initialCategories,
            initialBudgets,
            initialMonth,
            initialYear,
            onCloseCreate: () => setCreateOpen(false),
            onCloseEdit: () => setEditingCategory(null),
            onCloseDelete: () => setDeletingCategory(null),
            onCloseBudget: () => setBudgetingCategory(null),
        }
    );

    const [editingCategory, setEditingCategory] = useState<CategoryApi | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryApi | null>(null);
    const [budgetingCategory, setBudgetingCategory] = useState<CategoryApi | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const editingOpen = Boolean(editingCategory);
    const deletingOpen = Boolean(deletingCategory);
    const budgetingOpen = Boolean(budgetingCategory);

    function closeEditingSheet(open: boolean) {
        if (!open) {
            setEditingCategory(null);
        }
    }

    function closeDeletingSheet(open: boolean) {
        if (!open) {
            setDeletingCategory(null);
        }
    }

    function closeBudgetSheet(open: boolean) {
        if (!open) {
            setBudgetingCategory(null);
        }
    }

    function handleEditCategory(values: Parameters<typeof handleCreateCategory>[0]) {
        if (!editingCategory) {
            return;
        }

        handleUpdateCategory({
            id: editingCategory.id,
            name: values.name,
            icon: values.icon as CategoryApi["icon"],
        });
    }

    const t = useTranslations("categories");

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

                <MonthYearSelector
                    month={selectedPeriod.month}
                    year={selectedPeriod.year}
                    onChange={setSelectedPeriod}
                />

                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="size-4" />
                    {t("createButton")}
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">
                    <CategoryTable
                        categories={categories}
                        onEdit={setEditingCategory}
                        onDelete={setDeletingCategory}
                        onSetBudget={setBudgetingCategory}
                        themes={iconThemes}
                        budgetsByCategoryId={budgetMapByCategoryId}
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
                                    className={!hasPreviousPage ? "pointer-events-none opacity-50" : undefined}
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
                                    className={!hasNextPage ? "pointer-events-none opacity-50" : undefined}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>

            <CategoryFormSheet
                open={createOpen}
                mode="create"
                themes={iconThemes}
                onOpenChange={setCreateOpen}
                onSubmit={handleCreateCategory}
                isSubmitting={isCreatingCategory}
            />

            <CategoryFormSheet
                open={editingOpen}
                mode="edit"
                themes={iconThemes}
                category={editingCategory ?? undefined}
                onOpenChange={closeEditingSheet}
                onSubmit={handleEditCategory}
                isSubmitting={isUpdatingCategory}
            />

            <DeleteCategorySheet
                category={deletingCategory ?? undefined}
                open={deletingOpen}
                onOpenChange={closeDeletingSheet}
                isDeleting={isDeletingCategory}
                onSubmit={() => {
                    if (!deletingCategory) {
                        return;
                    }

                    handleDeleteCategory(deletingCategory.id);
                }}
            />

            <BudgetLimitSheet
                category={budgetingCategory ?? undefined}
                open={budgetingOpen}
                onOpenChange={closeBudgetSheet}
                period={selectedPeriod}
                currentLimitAmount={
                    budgetingCategory
                        ? budgetMapByCategoryId.get(budgetingCategory.id)?.limitAmount
                        : undefined
                }
                isSubmitting={isSavingBudget}
                onSubmit={(value) => {
                    if (!budgetingCategory) {
                        return;
                    }

                    handleUpsertBudget({
                        category: budgetingCategory,
                        limitAmount: value,
                    });
                }}
            />
        </div>
    );
}
