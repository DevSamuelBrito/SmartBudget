"use client";

// libs
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

// i18n
import { useTranslations } from "next-intl";

// icons
import { FileDown } from "lucide-react";

// components
import { Button } from "@/components/ui/button";

import { MonthlyReportPDF, type MonthlyReportPDFLabels } from "./MonthlyReportPDF";

// types
import type { MonthlyReportApi } from "../types";

type MonthlyReportPreviewProps = {
  report: MonthlyReportApi;
  labels: MonthlyReportPDFLabels;
  locale: string;
  fileName: string;
  children?: React.ReactNode;
};

export function MonthlyReportPreview({
  report,
  labels,
  locale,
  fileName,
  children,
}: Readonly<MonthlyReportPreviewProps>) {
  const t = useTranslations("reports");

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border">
        <PDFViewer style={{ width: "100%", height: "70vh" }} showToolbar={false}>
          <MonthlyReportPDF report={report} labels={labels} locale={locale} />
        </PDFViewer>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PDFDownloadLink
          document={<MonthlyReportPDF report={report} labels={labels} locale={locale} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <Button variant="outline" disabled={loading}>
              <FileDown className="size-4" />
              {loading ? t("preparingPdf") : t("downloadPdf")}
            </Button>
          )}
        </PDFDownloadLink>

        {children}
      </div>
    </>
  );
}
