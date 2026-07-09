using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.Common.DTOs;

public record MonthlyReportDto(
    int Month,
    int Year,
    string UserName,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance,
    IReadOnlyList<MonthlyReportTransactionDto> Transactions,
    IReadOnlyList<MonthlyReportCategorySummaryDto> CategorySummary
);

public record MonthlyReportTransactionDto(
    DateTime Date,
    string Description,
    string CategoryName,
    FinancialTransactionType Type,
    decimal Amount,
    RecurrenceType Recurrence
);

public record MonthlyReportCategorySummaryDto(
    string CategoryName,
    decimal TotalSpent,
    decimal Percentage,
    decimal BudgetLimit,
    BudgetStatus? BudgetStatus
);
