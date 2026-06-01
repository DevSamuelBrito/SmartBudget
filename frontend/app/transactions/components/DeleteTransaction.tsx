"use client";

// icons
import { Loader2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

// types
import type { TransactionApi } from "../types";

type DeleteTransactionSheetProps = {
    transaction?: TransactionApi;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    isDeleting?: boolean;
};

export function DeleteTransactionSheet({
    transaction,
    open,
    onOpenChange,
    onSubmit,
    isDeleting = false,
}: DeleteTransactionSheetProps) {
    if (!transaction) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (isDeleting && !nextOpen) {
                    return;
                }

                onOpenChange(nextOpen);
            }}
        >
            <SheetContent side="right" className="sm:max-w-md" closeButtonDisabled={isDeleting}>
                <SheetHeader>
                    <SheetTitle>Excluir transação</SheetTitle>
                    <SheetDescription>
                        Você tem certeza que deseja excluir <strong>{transaction.description}</strong>?
                    </SheetDescription>
                </SheetHeader>

                <SheetFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onSubmit}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="size-4 animate-spin" />}
                        Excluir
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
