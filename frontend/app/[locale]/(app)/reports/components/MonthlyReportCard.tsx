"use client";

// react
import { useState } from "react";

// next
import dynamic from "next/dynamic";

// i18n
import { useLocale, useTranslations } from "next-intl";

// icons
import { FileSpreadsheet, FileTextIcon, Loader2 } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { MonthYearSelector } from "@/components/shared/month-year-selector";

// hooks
import { useMonthlyReport } from "../hooks/useMonthlyReport";

// types
import type { MonthlyReportPDFLabels } from "./MonthlyReportPDF";

import type { MonthlyReportApi } from "../types";

type MonthlyReportCardProps = {
  initialData: MonthlyReportApi;
  initialMonth: number;
  initialYear: number;
};

const MonthlyReportPreview = dynamic(
  () => import("./MonthlyReportPreview").then((mod) => mod.MonthlyReportPreview),
  { ssr: false },
);

export function MonthlyReportCard({
  initialData,
  initialMonth,
  initialYear,
}: Readonly<MonthlyReportCardProps>) {
  const t = useTranslations("reports");
  const tMonths = useTranslations("categories.months");
  const locale = useLocale();

  const { period, setPeriod, report, isLoading, exportExcel, isExportingExcel } = useMonthlyReport({
    initialData,
    initialMonth,
    initialYear,
  });

  const [showPreview, setShowPreview] = useState(false);

  function handlePeriodChange(next: { month: number; year: number }) {
    setShowPreview(false);
    setPeriod(next);
  }

  function handleGenerate() {
    setShowPreview(true);
  }

  const monthLabel = tMonths(String(period.month) as Parameters<typeof tMonths>[0]);

  const labels: MonthlyReportPDFLabels = {
    brand: "SmartBudget PRO",
    title: t("pdf.title", { month: monthLabel, year: period.year }),
    summaryIncome: t("summary.income"),
    summaryExpense: t("summary.expense"),
    summaryBalance: t("summary.balance"),
    transactionsTitle: t("transactionsTable.title"),
    transactionsEmpty: t("transactionsTable.empty"),
    transactionsColumns: {
      date: t("transactionsTable.date"),
      description: t("transactionsTable.description"),
      category: t("transactionsTable.category"),
      type: t("transactionsTable.type"),
      amount: t("transactionsTable.amount"),
    },
    typeLabels: {
      income: t("transactionsTable.typeIncome"),
      expense: t("transactionsTable.typeExpense"),
      transfer: t("transactionsTable.typeTransfer"),
    },
    budgetsTitle: t("categoriesTable.title"),
    budgetsEmpty: t("categoriesTable.empty"),
    budgetColumns: {
      category: t("categoriesTable.category"),
      limit: t("categoriesTable.budget"),
      spent: t("categoriesTable.spent"),
      percentage: t("pdf.percentageUsed"),
      status: t("categoriesTable.status"),
    },
    statusLabels: {
      ok: t("pdf.statusOk"),
      warning: t("pdf.statusWarning"),
      exceeded: t("pdf.statusExceeded"),
      none: t("pdf.statusNone"),
    },
    generatedAt: t("pdf.generatedAt", { date: new Date().toLocaleString(locale) }),
  };

  const fileName = `SmartBudget-${period.month}-${period.year}.pdf`;

  const isPreviewReady = showPreview && !isLoading;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <MonthYearSelector month={period.month} year={period.year} onChange={handlePeriodChange} />

        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileTextIcon className="size-4" />
          )}
          {isLoading ? t("generatingButton") : t("generateButton")}
        </Button>
      </div>

      {!showPreview ? (
        <div className="flex h-[70vh] w-full items-center justify-center rounded-xl border text-center text-muted-foreground">
          <p>
            {t("selectPeriodMessage")}
          </p>
        </div>
      ) : isPreviewReady ? (
        <MonthlyReportPreview
          report={report}
          labels={labels}
          locale={locale}
          fileName={fileName}
        >
          <Button onClick={() => exportExcel()} disabled={isExportingExcel}>
            <FileSpreadsheet className="size-4" />
            {isExportingExcel ? t("exportingExcel") : t("exportExcel")}
          </Button>
        </MonthlyReportPreview>
      ) : (
        <div className="flex h-[70vh] w-full items-center justify-center rounded-xl border text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          {t("loadingPreview")}
        </div>
      )}
    </div>
  );
}
