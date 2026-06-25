using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;

public record GetDashboardOverviewUseCaseOutput(
    int Month,
    int Year,
    DashboardKpisDto Kpis,
    decimal DailyAverageIncome,
    decimal DailyAverageExpense,
    DashboardFinancialRiskDto FinancialRisk,
    IReadOnlyList<DashboardLatestTransactionDto> LatestTransactions,
    IReadOnlyList<DashboardCategoryExpenseDto> CategoryExpenses,
    IReadOnlyList<DashboardCategoryExpenseDto> CategoryExpensePie,
    IReadOnlyList<DashboardIncomeExpenseByMonthDto> IncomeVsExpenseByMonth,
    IReadOnlyList<DashboardBalanceEvolutionPointDto> BalanceEvolution,
    IReadOnlyList<DashboardBudgetProgressDto> BudgetProgress,
    IReadOnlyList<DashboardAlertDto> Alerts,
    IReadOnlyList<DashboardExpenseByMonthDto>? ExpenseEvolutionByMonth
);

public record DashboardKpisDto(
    decimal CurrentBalance,
    decimal MonthlyIncome,
    decimal MonthlyExpense,
    decimal MonthlySavings
);

public record DashboardLatestTransactionDto(
    Guid Id,
    Guid UserId,
    Guid? TransactionCategoryId,
    string? CategoryName,
    string? CategoryIcon,
    decimal Amount,
    DateTime TransactionDate,
    FinancialTransactionType Type,
    string Description
);

public record DashboardCategoryExpenseDto(
    Guid? TransactionCategoryId,
    string CategoryName,
    string CategoryIcon,
    decimal Amount,
    decimal Percentage
);

public record DashboardIncomeExpenseByMonthDto(
    int Year,
    int Month,
    decimal Income,
    decimal Expense
);

public record DashboardBalanceEvolutionPointDto(
    DateTime Date,
    decimal Balance
);

public record DashboardBudgetProgressDto(
    Guid BudgetId,
    Guid TransactionCategoryId,
    string CategoryName,
    string CategoryIcon,
    decimal LimitAmount,
    decimal SpentAmount,
    decimal RemainingAmount,
    decimal Percentage,
    BudgetStatus Status
);

public record DashboardAlertDto(
    string Type,
    Guid BudgetId,
    Guid TransactionCategoryId,
    string CategoryName,
    decimal Percentage,
    BudgetStatus Status
);

public record DashboardFinancialRiskDto(
    decimal AverageIncome,
    decimal FixedExpenses,
    decimal Percentage,
    string Status
);

public record DashboardExpenseByMonthDto(
    int Year,
    int Month,
    decimal Expense
);
