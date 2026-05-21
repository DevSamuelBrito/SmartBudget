"use client";

// react
import { useRef } from "react";

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
import type { CategoryApi, CategoryTheme } from "../types";

type CategoryTableProps = {
    categories: CategoryApi[];
    onEdit: (category: CategoryApi) => void;
    onDelete: (category: CategoryApi) => void;
    themes: CategoryTheme[];
};

export function CategoryTable({
    categories,
    onEdit,
    onDelete,
    themes,
}: CategoryTableProps) {
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);


    function getTheme(iconKey: CategoryApi["icon"]) {
        return themes.find((theme) => theme.iconKey === iconKey);
    }

    const renderTableBody = () => {
        return categories.map((category) => {
            const theme = getTheme(category.icon);

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
        });

    }

    return (
        <div className="rounded-xl border">
            <div ref={scrollAreaRef} className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24">Icone</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead className="w-28">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {renderTableBody()}
                    </TableBody>
                </Table>

            </div>
        </div>
    );
}
