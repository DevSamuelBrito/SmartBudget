"use client";

// react
import { useState } from "react";

// ui
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

// components
import { ThemeIcon } from "./theme-icons";

// types 
import type { Category, CategoryTheme } from "../types";

type CategoryFormValues = {
    name: string;
    themeId: string;
};

type CategoryFormSheetProps = {
    open: boolean;
    mode: "create" | "edit";
    themes: CategoryTheme[];
    category?: Category;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: CategoryFormValues) => void;
};

export function CategoryFormSheet({
    open,
    mode,
    themes,
    category,
    onOpenChange,
    onSubmit,
}: CategoryFormSheetProps) {
    const [name, setName] = useState(category?.name ?? "");
    const [themeId, setThemeId] = useState(category?.themeId ?? themes[0]?.id ?? "");

    function resetForm() {
        setName("");
        setThemeId(themes[0]?.id ?? "");
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName || !themeId) {
            return;
        }

        onSubmit({
            name: trimmedName,
            themeId,
        });

        if (mode === "create") {
            resetForm();
        }
    }

    const title = mode === "create" ? "Criar categoria" : "Renomear categoria";

    const description =
        mode === "create"
            ? "Escolha um nome e um Icone para a nova categoria."
            : "Atualize o nome e o Icone da categoria.";

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen && mode === "create") {
                    resetForm();
                }

                onOpenChange(nextOpen);
            }}
        >
            <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                <form className="space-y-4 px-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Nome</Label>
                        <Input
                            id="category-name"
                            placeholder="Ex: Conta de Luz"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icones</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setThemeId(theme.id)}
                                    className="transition"
                                    aria-label={`Selecionar tema ${theme.label}`}
                                >
                                    <div
                                        className={`flex size-14 items-center justify-center rounded-lg text-white transition ${themeId === theme.id ? "ring-2 ring-primary ring-offset-2" : ""
                                            } ${theme.colorClass}`}
                                    >
                                        <ThemeIcon iconKey={theme.iconKey} className="size-5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <SheetFooter className="px-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
