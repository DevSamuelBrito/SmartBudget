"use client";

// external
import { useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";

// ui
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

// components
import { CategoryFormSheet } from "./CategoryForm";

import { CategoryTable } from "./CategoryTable";

import { DeleteCategorySheet } from "./DeleteCategory";

// hooks
import { useCategories } from "../hooks/useCategories";

//types
import type { Category } from "../types";

export function CategoriesScreen() {
    const {
        categories,
        createCategory,
        deleteCategory,
        hasMore,
        loadMore,
        search,
        setSearch,
        themes,
        updateCategory,
    } = useCategories();

    const [createOpen, setCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const editingOpen = useMemo(() => Boolean(editingCategory), [editingCategory]);
    const deletingOpen = useMemo(() => Boolean(deletingCategory), [deletingCategory]);

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
                    <CategoryTable
                        categories={categories}
                        hasMore={hasMore}
                        loadMore={loadMore}
                        onEdit={setEditingCategory}
                        onDelete={setDeletingCategory}
                        themes={themes}
                    />
                </CardContent>
            </Card>

            <CategoryFormSheet
                open={createOpen}
                mode="create"
                themes={themes}
                onOpenChange={setCreateOpen}
                onSubmit={(values) => {
                    createCategory(values);
                    setCreateOpen(false);
                }}
            />

            <CategoryFormSheet
                open={editingOpen}
                mode="edit"
                themes={themes}
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
