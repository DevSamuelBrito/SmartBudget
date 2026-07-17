"use client";

// react
import { useEffect, useMemo, useState } from "react";

// i18n
import { useLocale, useTranslations } from "next-intl";

// zod
import { zodResolver } from "@hookform/resolvers/zod";

// lucide
import { CalendarIcon, CircleHelp, Loader2 } from "lucide-react";

// react-hook-form
import { useForm, useWatch } from "react-hook-form";

// date
import { format } from "date-fns";

// components
import { ThemeIcon, iconMap, type ThemeIconKey } from "@/app/[locale]/(app)/categories/components/theme-icons";

import { ICONT_THEME } from "@/app/[locale]/(app)/categories/constants/icons-theme";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// utils
import { getDateFnsLocale } from "@/lib/date-locale";

// types
import type { CategoryApi } from "@/app/[locale]/(app)/categories/types";

import type { AppLocale } from "@/i18n/routing";

import { transactionFormSchema, type TransactionFormValues } from "../schemas/transaction.schema";

import type { TransactionApi } from "../types";

type TransactionFormSheetProps = {
    open: boolean;
    mode: "create" | "edit";
    categories: CategoryApi[];
    transaction?: TransactionApi;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: TransactionFormValues) => void;
    isSubmitting?: boolean;
};

const isThemeIconKey = (iconKey: string | null | undefined): iconKey is ThemeIconKey => {
    return Boolean(iconKey && iconKey in iconMap);
};

const defaultTransactionValues: TransactionFormValues = {
    amount: 1,
    transactionDate: "",
    transactionType: 1,
    recurrence: 0,
    description: "",
    transactionCategoryId: null,
};

export function TransactionFormSheet({
    open,
    mode,
    categories,
    transaction,
    onOpenChange,
    onSubmit,
    isSubmitting = false,
}: Readonly<TransactionFormSheetProps>) {
    "use no memo";

    const t = useTranslations("transactions");
    const locale = useLocale() as AppLocale;
    const calendarLocale = getDateFnsLocale(locale);

    const transactionTypeOptions = [
        { label: t("types.receita"), value: 1 },
        { label: t("types.despesa"), value: 2 },
        { label: t("types.transferencia"), value: 3 },
    ] as const;

    const recurrenceOptions = [
        { label: t("recurrence.unica"), value: 0 },
        { label: t("recurrence.recorrente"), value: 1 },
    ] as const;

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: defaultTransactionValues,
    });

    const [categoryQuery, setCategoryQuery] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);

    const [prevOpen, setPrevOpen] = useState(open);
    
    if (prevOpen !== open) {
        setPrevOpen(open);
        if (open && !transaction) setCategoryQuery("");
    }

    useEffect(() => {
        if (!open) return;

        if (transaction) {
            reset({
                amount: transaction.amount,
                transactionDate: transaction.transactionDate.slice(0, 10),
                transactionType: transaction.type,
                recurrence: transaction.recurrence,
                description: transaction.description,
                transactionCategoryId: transaction.type === 3 ? null : transaction.transactionCategoryId,
            });
        } else {
            reset(defaultTransactionValues);
        }
    }, [open, transaction, reset]);

    const transactionCategoryId = useWatch({ control, name: "transactionCategoryId" });

    const transactionDate = useWatch({ control, name: "transactionDate" });
    const transactionType = useWatch({ control, name: "transactionType" });
    const recurrence = useWatch({ control, name: "recurrence" });
    const isTransferTransaction = transactionType === 3;

    const selectedCategory = useMemo(() => {
        return categories.find((category) => category.id === transactionCategoryId) ?? null;
    }, [categories, transactionCategoryId]);

    const selectedCategoryTheme = useMemo(() => {
        if (!selectedCategory) {
            return null;
        }

        return ICONT_THEME.find((theme) => theme.iconKey === selectedCategory.icon) ?? null;
    }, [selectedCategory]);

    const selectedTransactionDate = useMemo(() => {
        if (!transactionDate) {
            return undefined;
        }

        const [year, month, day] = transactionDate.split("-").map(Number);

        return new Date(year, month - 1, day);
    }, [transactionDate]);

    const filteredCategories = useMemo(() => {
        const normalizedQuery = categoryQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return categories;
        }

        return categories.filter((category) =>
            category.name.toLowerCase().includes(normalizedQuery),
        );
    }, [categories, categoryQuery]);

    const displayedCategoryQuery =
        categoryQuery || (isTransferTransaction ? "" : (selectedCategory?.name ?? ""));

    function submitForm(values: TransactionFormValues) {
        const [year, month, day] = values.transactionDate.split("-").map(Number);

        const transactionDate = new Date(Date.UTC(year, month - 1, day))
            .toISOString()
            .replace(".000Z", "Z");

        onSubmit({
            amount: values.amount,
            transactionDate,
            transactionType: values.transactionType,
            recurrence: values.recurrence,
            description: values.description.trim(),
            transactionCategoryId: values.transactionCategoryId,
        });
    }

    function handleSelectCategory(category: CategoryApi) {
        setValue("transactionCategoryId", category.id, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setCategoryQuery(category.name);
        setCategoryOpen(false);
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

                if (!nextOpen) {
                    setCategoryQuery("");
                    setCategoryOpen(false);
                    setDateOpen(false);
                }

                onOpenChange(nextOpen);
            }}
        >
            <SheetContent side="right" className="sm:max-w-md" closeButtonDisabled={isSubmitting}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                <form id="transaction-form" className="space-y-4 px-4" onSubmit={handleSubmit(submitForm)}>
                    <div className="space-y-2">
                        <Label htmlFor="transaction-amount">{t("form.amountLabel")}</Label>
                        <Input
                            id="transaction-amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t("form.amountPlaceholder")}
                            {...register("amount", { valueAsNumber: true })}
                            aria-invalid={Boolean(errors.amount)}
                            disabled={isSubmitting}
                        />
                        {errors.amount && (
                            <p className="text-sm text-destructive">{errors.amount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transaction-date">{t("form.dateLabel")}</Label>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    data-empty={!selectedTransactionDate}
                                    className="h-12 w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                    aria-invalid={Boolean(errors.transactionDate)}
                                    disabled={isSubmitting}
                                >
                                    <CalendarIcon className="size-4" />
                                    {selectedTransactionDate ? (
                                        format(selectedTransactionDate, "PPP", { locale: calendarLocale })
                                    ) : (
                                        <span>{t("form.datePlaceholder")}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    locale={calendarLocale}
                                    selected={selectedTransactionDate}
                                    defaultMonth={selectedTransactionDate}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        if (!date) {
                                            setValue("transactionDate", "", {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                            setDateOpen(false);

                                            return;
                                        }

                                        setValue(
                                            "transactionDate",
                                            format(date, "yyyy-MM-dd"),
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            },
                                        );
                                        setDateOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.transactionDate && (
                            <p className="text-sm text-destructive">{errors.transactionDate.message}</p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t("form.typeLabel")}</Label>
                            <Select
                                value={String(transactionType)}
                                onValueChange={(value) => {
                                    const nextType = Number(value) as TransactionFormValues["transactionType"];

                                    setValue("transactionType", nextType, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });

                                    if (nextType === 3) {
                                        setValue("transactionCategoryId", null, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                        setCategoryQuery("");
                                        setCategoryOpen(false);
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.transactionType)}>
                                    <SelectValue placeholder={t("form.typePlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {transactionTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.transactionType && (
                                <p className="text-sm text-destructive">{errors.transactionType.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t("form.recurrenceLabel")}</Label>
                            <Select
                                value={String(recurrence)}
                                onValueChange={(value) => {
                                    setValue("recurrence", Number(value) as TransactionFormValues["recurrence"], {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.recurrence)}>
                                    <SelectValue placeholder={t("form.recurrencePlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {recurrenceOptions.map((option) => (
                                        <SelectItem key={option.value} value={String(option.value)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.recurrence && (
                                <p className="text-sm text-destructive">{errors.recurrence.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transaction-description">{t("form.descriptionLabel")}</Label>
                        <Input
                            id="transaction-description"
                            placeholder={t("form.descriptionPlaceholder")}
                            {...register("description")}
                            aria-invalid={Boolean(errors.description)}
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transaction-category">{t("form.categoryLabel")}</Label>
                        {isTransferTransaction && (
                            <p className="text-sm text-muted-foreground">
                                {t("form.categoryTransferNote")}
                            </p>
                        )}
                        <div className="relative">
                            {selectedCategory && selectedCategoryTheme && (
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <div
                                        className={`flex size-8 items-center justify-center rounded-lg text-white ${selectedCategoryTheme.colorClass}`}
                                    >
                                        {isThemeIconKey(selectedCategory.icon) ? (
                                            <ThemeIcon iconKey={selectedCategory.icon} className="size-4" />
                                        ) : (
                                            <CircleHelp className="size-4" />
                                        )}
                                    </div>
                                </div>
                            )}
                            <Input
                                id="transaction-category"
                                placeholder={
                                    isTransferTransaction
                                        ? t("form.categoryTransferPlaceholder")
                                        : t("form.categoryPlaceholder")
                                }
                                value={displayedCategoryQuery}
                                onFocus={() => {
                                    if (!isTransferTransaction) {
                                        setCategoryOpen(true);
                                    }
                                }}
                                onChange={(event) => {
                                    setCategoryQuery(event.target.value);

                                    if (!isTransferTransaction) {
                                        setCategoryOpen(true);
                                        setValue("transactionCategoryId", null, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    }
                                }}
                                onBlur={() => {
                                    setTimeout(() => setCategoryOpen(false), 150);
                                }}
                                className={`${selectedCategory ? "pl-14" : ""} h-12`}
                                aria-invalid={Boolean(errors.transactionCategoryId)}
                                disabled={isSubmitting || isTransferTransaction}
                                autoComplete="off"
                            />

                            {categoryOpen && !isTransferTransaction && (
                                <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-lg">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    handleSelectCategory(category);
                                                }}
                                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground"
                                                disabled={isSubmitting}
                                            >
                                                <div
                                                    className={`flex size-8 items-center justify-center rounded-lg text-white ${ICONT_THEME.find((item) => item.iconKey === category.icon)?.colorClass ?? "bg-muted"}`}
                                                >
                                                    {isThemeIconKey(category.icon) ? (
                                                        <ThemeIcon iconKey={category.icon} className="size-4" />
                                                    ) : (
                                                        <CircleHelp className="size-4" />
                                                    )}
                                                </div>
                                                <span className="truncate">{category.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-sm text-muted-foreground">
                                            {t("form.noCategoryFound")}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.transactionCategoryId && (
                            <p className="text-sm text-destructive">{errors.transactionCategoryId.message}</p>
                        )}
                    </div>

                </form>

                <SheetFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        {t("form.cancel")}
                    </Button>
                    <Button form="transaction-form" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                        {t("form.save")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}