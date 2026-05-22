"use client";

// react
import { useState } from "react";

//react query
import { Plus, Search } from "lucide-react";

// ui
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

// components
import { CategoryFormSheet } from "./CategoryForm";

import { CategoryTable } from "./CategoryTable";

import { CategoryTableSkeleton } from "./category-table-skeleton";

import { DeleteCategorySheet } from "./DeleteCategory";

// hooks
import { useCategories } from "../hooks/useCategories";

//types
import { CategoryApi } from "../types";

export function CategoriesScreen() {
    const {
        categories,
        isLoadingCategories,

        iconThemes,

        handleCreateCategory,
        isCreatingCategory,

        deleteCategory,
        search,
        setSearch,
        updateCategory,
    } = useCategories(
        {
            onCloseCreate: () => setCreateOpen(false),
            onCloseEdit: () => setEditingCategory(null),
        }
    );

    const [editingCategory, setEditingCategory] = useState<CategoryApi | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryApi | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const editingOpen = Boolean(editingCategory);
    const deletingOpen = Boolean(deletingCategory);

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

    const renderTable = () => {
        return (
            isLoadingCategories ? (
                <CategoryTableSkeleton />
            ) : (
                <CategoryTable
                    categories={categories}
                    onEdit={setEditingCategory}
                    onDelete={setDeletingCategory}
                    themes={iconThemes}
                />
            )
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar categoria por nome"
                        className="pl-8"
                    />
                </div>

                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="size-4" />
                    Criar nova categoria
                </Button>
            </div>

            <Card>
                <CardContent className="pt-4">
                    {renderTable()}
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
                onSubmit={(values) => {
                    if (!editingCategory) {
                        return;
                    }

                    updateCategory(editingCategory.id, values);
                    setEditingCategory(null);
                }}
            />

            <DeleteCategorySheet
                category={deletingCategory ?? undefined}
                open={deletingOpen}
                onOpenChange={closeDeletingSheet}
                onConfirm={() => {
                    if (!deletingCategory) {
                        return;
                    }

                    deleteCategory(deletingCategory.id);
                    setDeletingCategory(null);
                }}
            />
        </div>
    );
}
