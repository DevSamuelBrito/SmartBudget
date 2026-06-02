"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Loader2 } from "lucide-react";

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

const monthLabel = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
] as const;

export function BudgetLimitSheet({
    open,
    category,
    period,
    currentLimitAmount,
    onOpenChange,
    onSubmit,
    isSubmitting = false,
}: BudgetLimitSheetProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const periodLabel = useMemo(() => {
        return `${monthLabel[period.month - 1]} de ${period.year}`;
    }, [period.month, period.year]);

    if (!category) {
        return null;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const rawValue = String(formData.get("limitAmount") ?? "");
        const parsedValue = Number(rawValue);

        if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
            setErrorMessage("Informe um valor maior que zero.");

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
                    <SheetTitle>Definir orcamento</SheetTitle>
                    <SheetDescription>
                        Defina o limite da categoria <strong>{category.name}</strong> para {periodLabel}.
                    </SheetDescription>
                </SheetHeader>

                <form
                    id="budget-form"
                    key={`${category.id}-${period.year}-${period.month}`}
                    className="space-y-2 px-4"
                    onSubmit={handleSubmit}
                >
                    <Label htmlFor="budget-limit">Valor limite</Label>
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
                        Cancelar
                    </Button>
                    <Button type="submit" form="budget-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        Salvar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
