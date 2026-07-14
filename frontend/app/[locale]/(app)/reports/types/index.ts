export type MonthlyReportTransactionApi = {
  date: string;
  description: string;
  categoryName: string;
  type: 1 | 2 | 3;
  amount: number;
  recurrence: 0 | 1;
};

export type MonthlyReportCategorySummaryApi = {
  categoryName: string;
  totalSpent: number;
  percentage: number;
  budgetLimit: number;
  budgetStatus: "Ok" | "Warning" | "Exceeded" | 1 | 2 | 3 | null;
};

export type MonthlyReportApi = {
  month: number;
  year: number;
  userName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: MonthlyReportTransactionApi[];
  categorySummary: MonthlyReportCategorySummaryApi[];
};
