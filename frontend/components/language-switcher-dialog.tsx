"use client"

// components
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// types
import { type AppLocale } from "@/i18n/routing"

type LanguageSwitcherDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    isChangingLocale: boolean
    onChangeLocale: (locale: AppLocale) => void
}

export function LanguageSwitcherDialog({
    open,
    onOpenChange,
    isChangingLocale,
    onChangeLocale,
}: LanguageSwitcherDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Idioma</DialogTitle>
                    <DialogDescription>
                        Escolha o idioma da aplicacao.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onChangeLocale("pt-BR")}
                        disabled={isChangingLocale}
                    >
                        PT-BR
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onChangeLocale("en")}
                        disabled={isChangingLocale}
                    >
                        EN
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
