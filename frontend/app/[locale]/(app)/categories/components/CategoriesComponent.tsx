"use client";

// react
import { useState } from "react";

// i18n
import { useTranslations } from "next-intl";

// icons
import { Plus, Search, X } from "lucide-react";

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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { MonthYearSelector } from "@/components/shared/month-year-selector";

import { CategoryFormSheet } from "./CategoryForm";

import { CategoryTable } from "./CategoryTable";

import { DeleteCategorySheet } from "./DeleteCategory";

import { BudgetLimitSheet } from "./BudgetLimitSheet";

import { ThemeIcon } from "./theme-icons";

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
}: Readonly<CategoriesScreenProps>) {
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

        pendingName,
        setPendingName,
        pendingIcon,
        setPendingIcon,
        handleSearch,
        handleClearFilters,
        appliedFilters,
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

    const hasActiveFilters = Boolean(appliedFilters.name || appliedFilters.icon);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                {/* Left group: name + icon filters */}
                <div className="flex flex-wrap items-end gap-2">
                    <div className="relative w-56">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={pendingName}
                            onChange={(e) => setPendingName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            placeholder={t("filters.namePlaceholder")}
                            className="pl-8"
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-10 px-0" aria-label="Filter by icon"
                            >
                                {pendingIcon ? (
                                    (() => {

                                        const theme = iconThemes.find((t) => t.iconKey === pendingIcon);

                                        return theme ? (
                                            <span className={`flex size-5 items-center justify-center rounded text-white ${theme.colorClass}`}>
                                                <ThemeIcon iconKey={theme.iconKey} className="size-3" />
                                            </span>
                                        ) : null;
                                    })()
                                ) : (
                                    <Search className="size-4 text-muted-foreground" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                            <div className="grid grid-cols-5 gap-1">
                                <button
                                    type="button"
                                    onClick={() => setPendingIcon("")}
                                    className={`flex size-8 items-center justify-center rounded border text-xs text-muted-foreground transition hover:bg-muted ${pendingIcon ? "" : "ring-2 ring-primary"}`}
                                    aria-label={t("filters.allIcons")}
                                >
                                    —
                                </button>
                                {iconThemes.map((theme) => (
                                    <button
                                        key={theme.iconKey}
                                        type="button"
                                        onClick={() => setPendingIcon(theme.iconKey)}
                                        className={`flex size-8 items-center justify-center rounded text-white transition ${theme.colorClass} ${pendingIcon === theme.iconKey ? "ring-2 ring-primary ring-offset-2" : "opacity-80 hover:opacity-100"}`}
                                        aria-label={theme.label}
                                    >
                                        <ThemeIcon iconKey={theme.iconKey} className="size-4" />
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleSearch} variant="default">
                        <Search className="size-4" />
                        {t("filters.searchButton")}
                    </Button>

                    {hasActiveFilters && (
                        <Button onClick={handleClearFilters} variant="outline">
                            <X className="size-4" />
                            {t("filters.clearButton")}
                        </Button>
                    )}
                </div>

                {/* Right group: period selector + new category */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="size-4" />
                        {t("createButton")}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="pt-4">

                    <div className="flex items-center justify-center gap-2 mb-5">
                        <MonthYearSelector
                            month={selectedPeriod.month}
                            year={selectedPeriod.year}
                            onChange={setSelectedPeriod}
                        />
                    </div>

                    <CategoryTable
                        categories={categories}
                        onEdit={setEditingCategory}
                        onDelete={setDeletingCategory}
                        onSetBudget={setBudgetingCategory}
                        themes={iconThemes}
                        budgetsByCategoryId={budgetMapByCategoryId}
                    />

                    {totalPages > 1 && <Pagination className="mt-4">
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
                    </Pagination>}
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
