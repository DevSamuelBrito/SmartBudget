"use client";

// react
import { useState } from "react";

// react-query
import { useMutation, useQuery } from "@tanstack/react-query";

// i18n
import { useTranslations } from "next-intl";

// libs
import { toast } from "sonner";

// apis / services
import {
  downloadMonthlyReportExcel,
  getMonthlyReport,
} from "../services/reports.service";

// types
import type { MonthlyReportApi } from "../types";

type UseMonthlyReportParams = {
  initialData: MonthlyReportApi;
  initialMonth: number;
  initialYear: number;
};

export function useMonthlyReport({
  initialData,
  initialMonth,
  initialYear,
}: Readonly<UseMonthlyReportParams>) {
  const t = useTranslations("reports");

  const [period, setPeriod] = useState({
    month: initialMonth,
    year: initialYear,
  });

  const isInitialPeriod =
    period.month === initialMonth && period.year === initialYear;

  const { data, isLoading } = useQuery({
    queryKey: ["reports", "monthly", period.month, period.year],
    queryFn: () => getMonthlyReport(period),
    initialData: isInitialPeriod ? initialData : undefined,
    staleTime: isInitialPeriod ? Infinity : 0,
  });

  const { mutate: exportExcel, isPending: isExportingExcel } = useMutation({
    mutationFn: () => downloadMonthlyReportExcel(period),
    onSuccess: () => toast.success(t("exportExcelSuccess")),
    onError: () => toast.error(t("exportExcelError")),
  });

  return {
    period,
    setPeriod,
    report: data ?? initialData,
    isLoading,
    exportExcel,
    isExportingExcel,
  };
}
