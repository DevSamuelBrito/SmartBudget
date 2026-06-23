"use client"

// i18n
import { useTranslations } from "next-intl"

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

function getLocaleFromCookie(): AppLocale | null {
    if (typeof document === "undefined") {
        return null
    }

    const cookieValue = document.cookie
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("NEXT_LOCALE="))

    if (!cookieValue) {
        return null
    }

    const locale = decodeURIComponent(cookieValue.split("=")[1] ?? "")

    return locale === "pt-BR" || locale === "en" ? locale : null
}

export function LanguageSwitcherDialog({
    open,
    onOpenChange,
    isChangingLocale,
    onChangeLocale,
}: Readonly<LanguageSwitcherDialogProps>) {
    const t = useTranslations("languageSwitcher")
    const currentLocale = open ? getLocaleFromCookie() : null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={currentLocale === "pt-BR" ? "default" : "outline"}
                        className={
                            currentLocale === "pt-BR"
                                ? "border-primary ring-2 ring-primary/20"
                                : ""
                        }
                        onClick={() => onChangeLocale("pt-BR")}
                        disabled={isChangingLocale}
                    >
                        🇧🇷 PT-BR
                    </Button>

                    <Button
                        type="button"
                        variant={currentLocale === "en" ? "default" : "outline"}
                        className={
                            currentLocale === "en"
                                ? "border-primary ring-2 ring-primary/20"
                                : ""
                        }
                        onClick={() => onChangeLocale("en")}
                        disabled={isChangingLocale}
                    >
                        🇺🇸 EN
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}