"use client";

// react
import { useEffect, useState } from "react";

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

//icons
import { Loader2 } from "lucide-react";

// types 
import type { CategoryApi, CategoryFormValues, CategoryTheme } from "../types";


type CategoryFormSheetProps = {
    open: boolean;
    mode: "create" | "edit";
    themes: CategoryTheme[];
    category?: CategoryApi;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: CategoryFormValues) => void;
    isSubmitting?: boolean;
};

export function CategoryFormSheet({
    open,
    mode,
    themes,
    category,
    onOpenChange,
    onSubmit,
    isSubmitting = false,
}: CategoryFormSheetProps) {

    const [name, setName] = useState(category?.name ?? "");
    const [icon, setIcon] = useState(category?.icon ?? themes[0]?.iconKey ?? "");

    useEffect(() => {
        if (!open) {
            resetForm()
            return
        }

        setName(category?.name ?? "")
        setIcon(category?.icon ?? themes[0]?.iconKey ?? "")
    }, [open, category, themes])

    function resetForm() {
        setName("");
        setIcon(themes[0]?.iconKey ?? "");
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName || !icon) {
            return;
        }

        onSubmit({
            name: trimmedName,
            icon,
        });

    }

    const title = mode === "create" ? "Criar categoria" : "Renomear categoria";

    const description =
        mode === "create"
            ? "Escolha um nome e um Icone para a nova categoria."
            : "Atualize o nome e o Icone da categoria.";

    const renderThemes = () => {
        return themes.map((theme) => (
            <button
                key={theme.id}
                type="button"
                onClick={() => setIcon(theme.iconKey)}
                className="transition"
                aria-label={`Selecionar tema ${theme.label}`}
                disabled={isSubmitting}
            >
                <div
                    className={`flex size-14 items-center justify-center rounded-lg text-white transition ${icon === theme.iconKey ? "ring-2 ring-primary ring-offset-2" : ""
                        } ${theme.colorClass}`}
                >
                    <ThemeIcon iconKey={theme.iconKey} className="size-5" />
                </div>
            </button>
        ));
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (isSubmitting && !nextOpen) {
                    return;
                }

                if (!nextOpen && mode === "create") {
                    resetForm();
                }

                onOpenChange(nextOpen);
            }}
        >
            <SheetContent side="right" className="sm:max-w-md" closeButtonDisabled={isSubmitting}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                <form id="category-form" className="space-y-4 px-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Nome</Label>
                        <Input
                            id="category-name"
                            placeholder="Ex: Conta de Luz"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icones</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {renderThemes()}
                        </div>
                    </div>
                </form>

                <SheetFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        form="category-form"  
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="animate-spin size-4 text-muted-foreground" />}
                        Salvar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
