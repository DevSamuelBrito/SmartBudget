"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MonthYearSelectorProps = {
  month: number;
  year: number;
  onChange: (period: { month: number; year: number }) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
};

const monthOptions = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Marco" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
] as const;

export function MonthYearSelector({
  month,
  year,
  onChange,
  minYear,
  maxYear,
  className,
}: MonthYearSelectorProps) {
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
        <SelectTrigger className="w-40" aria-label="Mes">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
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
        <SelectTrigger className="w-28" aria-label="Ano">
          <SelectValue placeholder="Ano" />
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
