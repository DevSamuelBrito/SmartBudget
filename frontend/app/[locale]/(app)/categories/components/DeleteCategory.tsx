"use client";

// i18n
import { useTranslations } from "next-intl";

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
import type { CategoryApi } from "../types";

type DeleteCategorySheetProps = {
    category?: CategoryApi;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    isDeleting?: boolean;
};

export function DeleteCategorySheet({
    category,
    open,
    onOpenChange,
    onSubmit,
    isDeleting = false,
}: Readonly<DeleteCategorySheetProps>) {
    const t = useTranslations("categories");

    if (!category) {
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
                    <SheetTitle>{t("delete.title")}</SheetTitle>
                    <SheetDescription>
                        {t.rich("delete.description", {
                            name: category.name,
                            strong: (chunks) => <strong>{chunks}</strong>,
                        })}
                    </SheetDescription>
                </SheetHeader>

                <SheetFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        {t("delete.cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onSubmit}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="size-4 animate-spin" />}
                        {t("delete.confirm")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
