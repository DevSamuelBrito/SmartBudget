"use client"

// react
import { useState } from "react"

// i18n
import { useLocale, useTranslations } from "next-intl"

// components
import { Button } from "@/components/ui/button"

import { LanguageSwitcherDialog } from "@/components/language-switcher-dialog"

import { FLAG_ICONS } from "@/components/shared/flag-icons"

// apis / services
import { setLocaleAction } from "@/app/actions/locale-actions"

// types
import type { AppLocale } from "@/i18n/routing"

export function LanguageToggle() {
  const t = useTranslations("languageSwitcher")
  const locale = useLocale() as AppLocale

  const [open, setOpen] = useState(false)
  const [isChangingLocale, setIsChangingLocale] = useState(false)

  const CurrentFlagIcon = FLAG_ICONS[locale]

  const handleChangeLocale = async (locale: AppLocale) => {
    setIsChangingLocale(true)
    await setLocaleAction(locale)
    window.location.reload()
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("title")}
        onClick={() => setOpen(true)}
      >
        <CurrentFlagIcon className="size-4 rounded-sm" />
      </Button>

      <LanguageSwitcherDialog
        open={open}
        onOpenChange={setOpen}
        isChangingLocale={isChangingLocale}
        onChangeLocale={handleChangeLocale}
      />
    </>
  )
}
