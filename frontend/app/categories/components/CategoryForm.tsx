"use client";

// react
import { useEffect } from "react";

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

//RHF
import { useForm } from "react-hook-form";

//zod
import { zodResolver } from "@hookform/resolvers/zod";

import { categoryFormSchema } from "../schemas/category.schema";

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
    const defaultIcon = category?.icon ?? themes[0]?.iconKey ?? "";

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category?.name ?? "",
            icon: defaultIcon,
        },
    });

    const icon = watch("icon");

    useEffect(() => {
        if (!open) {
            resetForm()
            return
        }

        reset({
            name: category?.name ?? "",
            icon: category?.icon ?? themes[0]?.iconKey ?? "",
        });
    }, [open, category, themes, reset])

    function resetForm() {
        reset({
            name: "",
            icon: themes[0]?.iconKey ?? "",
        });
    }

    function submitForm(values: CategoryFormValues) {
        onSubmit({
            name: values.name.trim(),
            icon: values.icon,
        });

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

                <form id="category-form" className="space-y-4 px-4" onSubmit={handleSubmit(submitForm)}>
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Nome</Label>
                        <Input
                            id="category-name"
                            placeholder="Ex: Conta de Luz"
                            {...register("name")}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Icones</Label>
                        <input type="hidden" {...register("icon")} />
                        <div className="grid grid-cols-4 gap-2">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setValue("icon", theme.iconKey, { shouldValidate: true, shouldDirty: true })}
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
                            ))}
                        </div>
                        {errors.icon && (
                            <p className="text-sm text-destructive">{errors.icon.message}</p>
                        )}
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
