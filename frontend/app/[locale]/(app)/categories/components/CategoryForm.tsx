"use client";

// react
import { useCallback, useEffect } from "react";

// i18n
import { useTranslations } from "next-intl";

// RHF
import { useForm, useWatch } from "react-hook-form";

// zod
import { zodResolver } from "@hookform/resolvers/zod";

// icons
import { Loader2 } from "lucide-react";

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
    "use no memo"

    const t = useTranslations("categories");
    const defaultIcon = category?.icon ?? themes[0]?.iconKey ?? "";

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: category?.name ?? "",
            icon: defaultIcon,
        },
    });

    const icon = useWatch({ control, name: "icon" });

    const resetForm = useCallback(
        (nextCategory?: CategoryApi) => {
            reset({
                name: nextCategory?.name ?? "",
                icon: nextCategory?.icon ?? themes[0]?.iconKey ?? "",
            });
        },
        [reset, themes],
    );

    useEffect(() => {
        if (!open) {
            resetForm();

            return;
        }

        resetForm(category);
    }, [open, category, resetForm]);

    function submitForm(values: CategoryFormValues) {
        onSubmit({
            name: values.name.trim(),
            icon: values.icon,
        });
    }

    const title = mode === "create" ? t("form.createTitle") : t("form.editTitle");

    const description =
        mode === "create"
            ? t("form.createDescription")
            : t("form.editDescription");

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
                        <Label htmlFor="category-name">{t("form.nameLabel")}</Label>
                        <Input
                            id="category-name"
                            placeholder={t("form.namePlaceholder")}
                            {...register("name")}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t("form.iconsLabel")}</Label>
                        <input type="hidden" {...register("icon")} />
                        <div className="grid grid-cols-4 gap-2">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setValue("icon", theme.iconKey, { shouldValidate: true, shouldDirty: true })}
                                    className="transition"
                                    aria-label={t("form.selectThemeAriaLabel", { label: theme.label })}
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
                        {t("form.cancel")}
                    </Button>
                    <Button
                        form="category-form"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="animate-spin size-4 text-muted-foreground" />}
                        {t("form.save")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
