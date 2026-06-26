export type DashboardKpis = {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
};

export type DashboardLatestTransaction = {
  id: string;
  userId: string;
  transactionCategoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  amount: number;
  transactionDate: string;
  type: 1 | 2 | 3;
  description: string;
};

export type DashboardCategoryExpense = {
  transactionCategoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
};

export type DashboardIncomeExpenseByMonth = {
  year: number;
  month: number;
  income: number;
  expense: number;
};

export type DashboardExpenseByMonth = {
  year: number;
  month: number;
  expense: number;
};

export type DashboardBalanceEvolutionPoint = {
  date: string;
  balance: number;
};

export type DashboardBudgetProgress = {
  budgetId: string;
  transactionCategoryId: string;
  categoryName: string;
  categoryIcon: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  status: "Ok" | "Warning" | "Exceeded" | 1 | 2 | 3;
};

export type DashboardAlertType = "BudgetExceeded" | "BudgetWarning";

export type DashboardAlert = {
  type: DashboardAlertType;
  budgetId: string;
  transactionCategoryId: string;
  categoryName: string;
  percentage: number;
  status: "Ok" | "Warning" | "Exceeded" | 1 | 2 | 3;
};

export type DashboardFinancialRisk = {
  averageIncome: number;
  fixedExpenses: number;
  percentage: number;
  status: "Ok" | "Warning" | "Risk" | "NoData" | "FinancialRisk";
};

export type DashboardSavingsRate = {
  rate: number;
  savedAmount: number;
  status: "Great" | "Ok" | "Low";
};

export type DashboardMonthlyComparison = {
  previousMonthIncome: number;
  previousMonthExpense: number;
  previousMonthBalance: number;
  incomeVariation: number;
  expenseVariation: number;
  balanceVariation: number;
};

export type DashboardTopExpense = {
  description: string;
  categoryName: string | null;
  categoryIcon: string | null;
  amount: number;
  date: string;
};

export type DashboardCashFlow = {
  weekNumber: number;
  totalIncome: number;
  totalExpense: number;
};

export type DashboardBudgetHealth = {
  score: number;
  okCount: number;
  warningCount: number;
  exceededCount: number;
  status: "Healthy" | "Moderate" | "AtRisk";
};

export type DashboardOverviewApi = {
  month: number;
  year: number;
  kpis: DashboardKpis;
  dailyAverageIncome: number;
  dailyAverageExpense: number;
  financialRisk: DashboardFinancialRisk;
  latestTransactions: DashboardLatestTransaction[];
  categoryExpenses: DashboardCategoryExpense[];
  categoryExpensePie: DashboardCategoryExpense[];
  incomeVsExpenseByMonth: DashboardIncomeExpenseByMonth[];
  balanceEvolution: DashboardBalanceEvolutionPoint[];
  budgetProgress: DashboardBudgetProgress[];
  alerts: DashboardAlert[];
  expenseEvolutionByMonth: DashboardExpenseByMonth[];
  savingsRate: DashboardSavingsRate | null;
  monthlyComparison: DashboardMonthlyComparison | null;
  topExpenses: DashboardTopExpense[] | null;
  cashFlow: DashboardCashFlow[] | null;
  budgetHealth: DashboardBudgetHealth | null;
};

export type DashboardConfigItem = {
  componentKey: string;
  order: number;
  columns: number;
  visible: boolean;
};
