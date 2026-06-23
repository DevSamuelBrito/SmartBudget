"use client";

//react
import { useMemo, useState } from "react";

import type { FormEvent } from "react";

// i18n
import { useTranslations } from "next-intl";


//lucide icons
import { Loader2 } from "lucide-react";

//components
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

//types
import type { CategoryApi } from "../types";

type BudgetLimitSheetProps = {
    open: boolean;
    category?: CategoryApi;
    period: { month: number; year: number };
    currentLimitAmount?: number;
    onOpenChange: (open: boolean) => void;
    onSubmit: (value: number) => void;
    isSubmitting?: boolean;
};

export function BudgetLimitSheet({
    open,
    category,
    period,
    currentLimitAmount,
    onOpenChange,
    onSubmit,
    isSubmitting = false,
}: Readonly<BudgetLimitSheetProps>) {
    const t = useTranslations("categories");

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const periodLabel = useMemo(() => {
        const month = t(`months.${period.month}`);

        return `${month} de ${period.year}`;
    }, [period.month, period.year, t]);

    if (!category) {
        return null;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        
        const limitAmount = formData.get("limitAmount");

        if (typeof limitAmount !== "string") {
            setErrorMessage(t("budget.errorInvalidAmount"));

            return;
        }

        const parsedValue = Number(limitAmount);

        if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
            setErrorMessage(t("budget.errorInvalidAmount"));

            return;
        }

        setErrorMessage(null);
        onSubmit(parsedValue);
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (isSubmitting && !nextOpen) {

                    return;
                }

                if (!nextOpen) {
                    setErrorMessage(null);
                }

                onOpenChange(nextOpen);
            }}
        >
            <SheetContent side="right" className="sm:max-w-md" closeButtonDisabled={isSubmitting}>
                <SheetHeader>
                    <SheetTitle>{t("budget.title")}</SheetTitle>
                    <SheetDescription>
                        {t.rich("budget.description", {
                            name: category.name,
                            period: periodLabel,
                            strong: (chunks) => <strong>{chunks}</strong>,
                        })}
                    </SheetDescription>
                </SheetHeader>

                <form
                    id="budget-form"
                    key={`${category.id}-${period.year}-${period.month}`}
                    className="space-y-2 px-4"
                    onSubmit={handleSubmit}
                >
                    <Label htmlFor="budget-limit">{t("budget.limitLabel")}</Label>
                    <Input
                        id="budget-limit"
                        name="limitAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex: 900.00"
                        defaultValue={typeof currentLimitAmount === "number" ? String(currentLimitAmount) : ""}
                        onChange={() => {
                            if (errorMessage) {
                                setErrorMessage(null);
                            }
                        }}
                        disabled={isSubmitting}
                    />
                    {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                </form>

                <SheetFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        {t("budget.cancel")}
                    </Button>
                    <Button type="submit" form="budget-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        {t("budget.save")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
