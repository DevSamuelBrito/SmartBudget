'use client';

// react
import { useMemo, useState } from "react";

// i18n
import { useLocale, useTranslations } from "next-intl";

// date
import { format } from "date-fns";

// icons
import { CalendarIcon, CircleHelp, Search, X } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ThemeIcon, iconMap, type ThemeIconKey } from "@/app/[locale]/(app)/categories/components/theme-icons";
import { ICONT_THEME } from "@/app/[locale]/(app)/categories/constants/icons-theme";

// utils
import { getDateFnsLocale } from "@/lib/date-locale";

// types
import type { CategoryApi } from "@/app/[locale]/(app)/categories/types";
import type { AppLocale } from "@/i18n/routing";
import type { FinancialTransactionType, RecurrenceType } from "../types";

type AppliedFilters = {
    description: string;
    categoryId: string;
    date: string;
    type: FinancialTransactionType | "";
    recurrence: RecurrenceType | "";
};

type TransactionFiltersBarProps = {
    pendingFilters: AppliedFilters;
    setPendingFilters: React.Dispatch<React.SetStateAction<AppliedFilters>>;
    categories: CategoryApi[];
    hasActiveFilters: boolean;
    onSearch: () => void;
    onClearFilters: () => void;
};

const ALL_VALUE = "__all__";

const isThemeIconKey = (iconKey: string | null | undefined): iconKey is ThemeIconKey => {
    return Boolean(iconKey && iconKey in iconMap);
};

export function TransactionFiltersBar({
    pendingFilters,
    setPendingFilters,
    categories,
    hasActiveFilters,
    onSearch,
    onClearFilters,
}: TransactionFiltersBarProps) {
    const t = useTranslations("transactions");
    const locale = useLocale() as AppLocale;
    const calendarLocale = getDateFnsLocale(locale);

    const [dateOpen, setDateOpen] = useState(false);
    const [categoryQuery, setCategoryQuery] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);

    const transactionTypeOptions = [
        { label: t("types.receita"), value: 1 as FinancialTransactionType },
        { label: t("types.despesa"), value: 2 as FinancialTransactionType },
        { label: t("types.transferencia"), value: 3 as FinancialTransactionType },
    ];

    const recurrenceOptions = [
        { label: t("recurrence.unica"), value: 0 as RecurrenceType },
        { label: t("recurrence.recorrente"), value: 1 as RecurrenceType },
    ];

    const selectedDate = useMemo(() => {
        if (!pendingFilters.date) return undefined;

        const [y, m, d] = pendingFilters.date.split("-").map(Number);

        return new Date(y, m - 1, d);
    }, [pendingFilters.date]);

    const selectedFilterCategory = useMemo(
        () => categories.find((c) => c.id === pendingFilters.categoryId) ?? null,
        [categories, pendingFilters.categoryId],
    );

    const selectedFilterCategoryTheme = useMemo(() => {
        if (!selectedFilterCategory) return null;


        return ICONT_THEME.find((theme) => theme.iconKey === 
        selectedFilterCategory.icon) ?? null;
    }, [selectedFilterCategory]);

    const filteredCategories = useMemo(() => {
        const q = categoryQuery.trim().toLowerCase();
        
        if (!q) return categories;

        return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, categoryQuery]);

    const displayedCategoryQuery = categoryQuery || (selectedFilterCategory?.name ?? "");

    function handleSelectFilterCategory(categoryId: string, categoryName: string) {
        setPendingFilters((prev) => ({ ...prev, categoryId }));
        setCategoryQuery(categoryName);
        setCategoryOpen(false);
    }

    function handleClearCategoryFilter() {
        setPendingFilters((prev) => ({ ...prev, categoryId: "" }));
        setCategoryQuery("");
    }

    function handleClear() {
        onClearFilters();
        setCategoryQuery("");
    }

    return (
        <div className="flex flex-wrap items-end gap-2">
            {/* Description */}
            <div className="relative w-46">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={pendingFilters.description}
                    onChange={(e) => setPendingFilters((prev) => ({ ...prev, description: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
                    placeholder={t("filters.descriptionPlaceholder")}
                    className="pl-8"
                />
            </div>

            {/* Category autocomplete */}
            <div className="relative w-44">
                {selectedFilterCategory && selectedFilterCategoryTheme && (
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <div className={`flex size-6 items-center justify-center rounded text-white ${selectedFilterCategoryTheme.colorClass}`}>
                            {isThemeIconKey(selectedFilterCategory.icon) ? (
                                <ThemeIcon iconKey={selectedFilterCategory.icon} className="size-3" />
                            ) : (
                                <CircleHelp className="size-3" />
                            )}
                        </div>
                    </div>
                )}
                <Input
                    placeholder={t("filters.categoryPlaceholder")}
                    value={displayedCategoryQuery}
                    onFocus={() => setCategoryOpen(true)}
                    onChange={(e) => {
                        setCategoryQuery(e.target.value);
                        setCategoryOpen(true);
                        setPendingFilters((prev) => ({ ...prev, categoryId: "" }));
                    }}
                    onBlur={() => { setTimeout(() => setCategoryOpen(false), 150); }}
                    className={selectedFilterCategory ? "pl-10" : ""}
                    autoComplete="off"
                />
                {selectedFilterCategory && (
                    <button
                        type="button"
                        onClick={handleClearCategoryFilter}
                        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                        aria-label="Clear category filter"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
                {categoryOpen && (
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-lg">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectFilterCategory(category.id, category.name);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground"
                                >
                                    <div className={`flex size-6 items-center justify-center rounded text-white ${ICONT_THEME.find((i) => i.iconKey === category.icon)?.colorClass ?? "bg-muted"}`}>
                                        {isThemeIconKey(category.icon) ? (
                                            <ThemeIcon iconKey={category.icon} className="size-3" />
                                        ) : (
                                            <CircleHelp className="size-3" />
                                        )}
                                    </div>
                                    <span className="truncate">{category.name}</span>
                                </button>
                            ))
                        ) : (
                            <p className="px-3 py-2 text-sm text-muted-foreground">{t("form.noCategoryFound")}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Date */}
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        data-empty={!selectedDate}
                        className="w-36 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                        <CalendarIcon className="size-4 shrink-0" />
                        {selectedDate
                            ? format(selectedDate, "dd/MM/yyyy", { locale: calendarLocale })
                            : <span>{t("filters.datePlaceholder")}</span>
                        }
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        locale={calendarLocale}
                        selected={selectedDate}
                        defaultMonth={selectedDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                            setPendingFilters((prev) => ({
                                ...prev,
                                date: d ? format(d, "yyyy-MM-dd") : "",
                            }));
                            setDateOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>

            {/* Type */}
            <Select
                value={pendingFilters.type !== "" ? String(pendingFilters.type) : ALL_VALUE}
                onValueChange={(value) =>
                    setPendingFilters((prev) => ({
                        ...prev,
                        type: value === ALL_VALUE ? "" : (Number(value) as FinancialTransactionType),
                    }))
                }
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder={t("filters.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>{t("filters.allTypes")}</SelectItem>
                    {transactionTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Recurrence */}
            <Select
                value={pendingFilters.recurrence !== "" ? String(pendingFilters.recurrence) : ALL_VALUE}
                onValueChange={(value) =>
                    setPendingFilters((prev) => ({
                        ...prev,
                        recurrence: value === ALL_VALUE ? "" : (Number(value) as RecurrenceType),
                    }))
                }
            >
                <SelectTrigger className="w-36">
                    <SelectValue placeholder={t("filters.recurrencePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>{t("filters.allRecurrences")}</SelectItem>
                    {recurrenceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button onClick={onSearch} variant="default">
                <Search className="size-4" />
                {t("filters.searchButton")}
            </Button>

            {hasActiveFilters && (
                <Button onClick={handleClear} variant="outline">
                    <X className="size-4" />
                    {t("filters.clearButton")}
                </Button>
            )}
        </div>
    );
}
