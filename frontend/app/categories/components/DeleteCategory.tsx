"use client";

// ui
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
import type { CategoryApi } from "../types";

type DeleteCategorySheetProps = {
    category?: CategoryApi;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export function DeleteCategorySheet({
    category,
    open,
    onOpenChange,
    onConfirm,
}: DeleteCategorySheetProps) {
    if (!category) {
        return null;
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Excluir categoria</SheetTitle>
                    <SheetDescription>
                        Você tem certeza que deseja excluir <strong>{category.name}</strong>?
                    </SheetDescription>
                </SheetHeader>

                <SheetFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm}>
                        Excluir
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
