"use client"

// next-themes
import { useTheme } from "next-themes"

// i18n
import { useTranslations } from "next-intl"

// icons
import { Monitor, Moon, Sun } from "lucide-react"

// components
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Separator } from "@/components/ui/separator"

import { BrazilFlagIcon, UnitedStatesFlagIcon } from "@/components/shared/flag-icons"

// types
import { type AppLocale } from "@/i18n/routing"


type SettingsDialogProps = {
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

export function SettingsDialog({
    open,
    onOpenChange,
    isChangingLocale,
    onChangeLocale,
}: Readonly<SettingsDialogProps>) {
    const t = useTranslations("settings")
    const { theme, setTheme } = useTheme()
    const currentLocale = open ? getLocaleFromCookie() : null

    const themes = [
        { value: "light", label: t("theme.light"), icon: Sun },
        { value: "dark", label: t("theme.dark"), icon: Moon },
        { value: "system", label: t("theme.system"), icon: Monitor },
    ] as const

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t("language.title")}</span>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant={currentLocale === "pt-BR" ? "default" : "outline"}
                                className={currentLocale === "pt-BR" ? "border-primary ring-2 ring-primary/20" : ""}
                                onClick={() => onChangeLocale("pt-BR")}
                                disabled={isChangingLocale}
                            >
                                <BrazilFlagIcon />
                                PT-BR
                            </Button>
                            <Button
                                type="button"
                                variant={currentLocale === "en" ? "default" : "outline"}
                                className={currentLocale === "en" ? "border-primary ring-2 ring-primary/20" : ""}
                                onClick={() => onChangeLocale("en")}
                                disabled={isChangingLocale}
                            >
                                <UnitedStatesFlagIcon />
                                EN
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">{t("theme.title")}</span>
                        <div className="grid grid-cols-3 gap-2">
                            {themes.map(({ value, label, icon: Icon }) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={theme === value ? "default" : "outline"}
                                    className={theme === value ? "border-primary ring-2 ring-primary/20" : ""}
                                    onClick={() => setTheme(value)}
                                >
                                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
