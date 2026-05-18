"use client";

// react
import { useEffect, useRef } from "react";

import { Pencil, Trash2 } from "lucide-react";

// ui
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// components
import { ThemeIcon } from "./theme-icons";

// types 
import type { Category, CategoryTheme } from "../types";

type CategoryTableProps = {
    categories: Category[];
    hasMore: boolean;
    loadMore: () => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    themes: CategoryTheme[];
};

export function CategoryTable({
    categories,
    hasMore,
    loadMore,
    onEdit,
    onDelete,
    themes,
}: CategoryTableProps) {
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!scrollAreaRef.current || !loaderRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            {
                root: scrollAreaRef.current,
                threshold: 0.3,
            }
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    function getTheme(themeId: string) {
        return themes.find((theme) => theme.id === themeId);
    }

    return (
        <div className="rounded-xl border">
            <div ref={scrollAreaRef} className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Icone</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead className="w-28">Acoes</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((category) => {
                            const theme = getTheme(category.themeId);

                            return (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {theme ? (
                                            <div
                                                className={`flex size-8 items-center justify-center rounded-md text-white ${theme.colorClass}`}
                                            >
                                                <ThemeIcon iconKey={theme.iconKey} className="size-4" />
                                            </div>
                                        ) : (
                                            <div className="size-8 rounded-md bg-muted" />
                                        )}
                                    </TableCell>

                                    <TableCell>{category.name}</TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                onClick={() => onEdit(category)}
                                                aria-label={`Editar ${category.name}`}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>

                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                onClick={() => onDelete(category)}
                                                aria-label={`Excluir ${category.name}`}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div ref={loaderRef} className="flex h-10 items-center justify-center text-xs text-muted-foreground">
                    {hasMore ? "Carregando mais categorias..." : "Fim da lista"}
                </div>
            </div>
        </div>
    );
}
