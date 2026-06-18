"use client";

import { useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MonthYearSelectorProps = {
  month: number;
  year: number;
  onChange: (period: { month: number; year: number }) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
};

const monthValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function MonthYearSelector({
  month,
  year,
  onChange,
  minYear,
  maxYear,
  className,
}: MonthYearSelectorProps) {
  const t = useTranslations("categories.months");

  const currentYear = new Date().getFullYear();
  const startYear = minYear ?? currentYear - 5;
  const endYear = maxYear ?? currentYear + 5;

  const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

  return (
    <div className={className ?? "flex items-center gap-2"}>
      <Select
        value={String(month)}
        onValueChange={(value) =>
          onChange({
            month: Number(value),
            year,
          })
        }
      >
        <SelectTrigger className="w-40" aria-label={t("monthAriaLabel")}>
          <SelectValue placeholder={t("monthPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {monthValues.map((value) => (
            <SelectItem key={value} value={String(value)}>
              {t(String(value) as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(year)}
        onValueChange={(value) =>
          onChange({
            month,
            year: Number(value),
          })
        }
      >
        <SelectTrigger className="w-28" aria-label={t("yearAriaLabel")}>
          <SelectValue placeholder={t("yearPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
