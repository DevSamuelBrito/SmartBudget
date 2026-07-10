"use client";

// libs
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// types
import type {
  MonthlyReportApi,
  MonthlyReportCategorySummaryApi,
  MonthlyReportTransactionApi,
} from "../types";

// utils
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils/formatters";

export type MonthlyReportPDFLabels = {
  brand: string;
  title: string;
  summaryIncome: string;
  summaryExpense: string;
  summaryBalance: string;
  transactionsTitle: string;
  transactionsEmpty: string;
  transactionsColumns: {
    date: string;
    description: string;
    category: string;
    type: string;
    amount: string;
  };
  typeLabels: {
    income: string;
    expense: string;
    transfer: string;
  };
  budgetsTitle: string;
  budgetsEmpty: string;
  budgetColumns: {
    category: string;
    limit: string;
    spent: string;
    percentage: string;
    status: string;
  };
  statusLabels: {
    ok: string;
    warning: string;
    exceeded: string;
    none: string;
  };
  generatedAt: string;
};

type MonthlyReportPDFProps = {
  report: MonthlyReportApi;
  labels: MonthlyReportPDFLabels;
  locale: string;
};

const COLORS = {
  blue: "#1d4ed8",
  green: "#16a34a",
  red: "#dc2626",
  border: "#e5e7eb",
  muted: "#6b7280",
  text: "#111827",
};

const TRANSACTION_COLUMN_WIDTHS = {
  date: "14%",
  description: "32%",
  category: "20%",
  type: "14%",
  amount: "20%",
};

const BUDGET_COLUMN_WIDTHS = {
  category: "28%",
  limit: "18%",
  spent: "18%",
  percentage: "16%",
  status: "20%",
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: COLORS.text,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue,
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.blue,
  },
  title: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryLabel: {
    fontSize: 8,
    color: COLORS.muted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.blue,
    marginBottom: 6,
    marginTop: 14,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.blue,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 8,
    fontWeight: 700,
    color: "#ffffff",
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
  },
  emptyText: {
    padding: 10,
    fontSize: 9,
    color: COLORS.muted,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    paddingTop: 6,
    fontSize: 7,
    color: COLORS.muted,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

function getTypeLabel(
  type: MonthlyReportTransactionApi["type"],
  labels: MonthlyReportPDFLabels["typeLabels"],
) {
  if (type === 1) return labels.income;
  if (type === 2) return labels.expense;

  return labels.transfer;
}

function getAmountColor(type: MonthlyReportTransactionApi["type"]) {
  if (type === 1) return COLORS.green;
  if (type === 2) return COLORS.red;

  return COLORS.text;
}

function getStatusLabel(
  status: MonthlyReportCategorySummaryApi["budgetStatus"],
  labels: MonthlyReportPDFLabels["statusLabels"],
) {
  if (status === "Ok" || status === 1) return labels.ok;
  if (status === "Warning" || status === 2) return labels.warning;
  if (status === "Exceeded" || status === 3) return labels.exceeded;

  return labels.none;
}

export function MonthlyReportPDF({ report, labels, locale }: Readonly<MonthlyReportPDFProps>) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{labels.brand}</Text>
          <Text style={styles.title}>{labels.title}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{labels.summaryIncome}</Text>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>
              {formatCurrency(report.totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{labels.summaryExpense}</Text>
            <Text style={[styles.summaryValue, { color: COLORS.red }]}>
              {formatCurrency(report.totalExpense)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardLast]}>
            <Text style={styles.summaryLabel}>{labels.summaryBalance}</Text>
            <Text style={styles.summaryValue}>{formatCurrency(report.balance)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{labels.transactionsTitle}</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, { width: TRANSACTION_COLUMN_WIDTHS.date }]}>
              {labels.transactionsColumns.date}
            </Text>
            <Text style={[styles.tableCellHeader, { width: TRANSACTION_COLUMN_WIDTHS.description }]}>
              {labels.transactionsColumns.description}
            </Text>
            <Text style={[styles.tableCellHeader, { width: TRANSACTION_COLUMN_WIDTHS.category }]}>
              {labels.transactionsColumns.category}
            </Text>
            <Text style={[styles.tableCellHeader, { width: TRANSACTION_COLUMN_WIDTHS.type }]}>
              {labels.transactionsColumns.type}
            </Text>
            <Text style={[styles.tableCellHeader, { width: TRANSACTION_COLUMN_WIDTHS.amount }]}>
              {labels.transactionsColumns.amount}
            </Text>
          </View>

          {report.transactions.length === 0 ? (
            <Text style={styles.emptyText}>{labels.transactionsEmpty}</Text>
          ) : (
            report.transactions.map((transaction, index) => (
              <View key={`${transaction.date}-${index}`} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, { width: TRANSACTION_COLUMN_WIDTHS.date }]}>
                  {formatDate(transaction.date)}
                </Text>
                <Text style={[styles.tableCell, { width: TRANSACTION_COLUMN_WIDTHS.description }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.tableCell, { width: TRANSACTION_COLUMN_WIDTHS.category }]}>
                  {transaction.categoryName}
                </Text>
                <Text style={[styles.tableCell, { width: TRANSACTION_COLUMN_WIDTHS.type }]}>
                  {getTypeLabel(transaction.type, labels.typeLabels)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: TRANSACTION_COLUMN_WIDTHS.amount, color: getAmountColor(transaction.type) },
                  ]}
                >
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>{labels.budgetsTitle}</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, { width: BUDGET_COLUMN_WIDTHS.category }]}>
              {labels.budgetColumns.category}
            </Text>
            <Text style={[styles.tableCellHeader, { width: BUDGET_COLUMN_WIDTHS.limit }]}>
              {labels.budgetColumns.limit}
            </Text>
            <Text style={[styles.tableCellHeader, { width: BUDGET_COLUMN_WIDTHS.spent }]}>
              {labels.budgetColumns.spent}
            </Text>
            <Text style={[styles.tableCellHeader, { width: BUDGET_COLUMN_WIDTHS.percentage }]}>
              {labels.budgetColumns.percentage}
            </Text>
            <Text style={[styles.tableCellHeader, { width: BUDGET_COLUMN_WIDTHS.status }]}>
              {labels.budgetColumns.status}
            </Text>
          </View>

          {report.categorySummary.length === 0 ? (
            <Text style={styles.emptyText}>{labels.budgetsEmpty}</Text>
          ) : (
            report.categorySummary.map((summary) => (
              <View key={summary.categoryName} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, { width: BUDGET_COLUMN_WIDTHS.category }]}>
                  {summary.categoryName}
                </Text>
                <Text style={[styles.tableCell, { width: BUDGET_COLUMN_WIDTHS.limit }]}>
                  {summary.budgetStatus !== null ? formatCurrency(summary.budgetLimit) : "—"}
                </Text>
                <Text style={[styles.tableCell, { width: BUDGET_COLUMN_WIDTHS.spent }]}>
                  {formatCurrency(summary.totalSpent)}
                </Text>
                <Text style={[styles.tableCell, { width: BUDGET_COLUMN_WIDTHS.percentage }]}>
                  {summary.budgetStatus !== null
                    ? `${formatPercentage(summary.percentage, locale, 0)}%`
                    : "—"}
                </Text>
                <Text style={[styles.tableCell, { width: BUDGET_COLUMN_WIDTHS.status }]}>
                  {getStatusLabel(summary.budgetStatus, labels.statusLabels)}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer} fixed>
          {labels.generatedAt}
        </Text>
      </Page>
    </Document>
  );
}
