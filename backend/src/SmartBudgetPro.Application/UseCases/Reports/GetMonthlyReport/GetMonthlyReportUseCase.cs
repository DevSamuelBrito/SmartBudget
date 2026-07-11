using FluentValidation;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.Reports.GetMonthlyReport;

public class GetMonthlyReportUseCase(
    IValidator<GetMonthlyReportUseCaseInput> validator
    IFinancialTransactionRepository transactionRepository,
    IBudgetRepository budgetRepository,
    ITransactionCategoryRepository categoryRepository,
    IUserRepository userRepository,)
{
    public async Task<MonthlyReportDto> ExecuteAsync(GetMonthlyReportUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var user = await userRepository.GetByIdAsync(input.UserId)
            ?? throw new UserNotFoundException();

        var transactions = (await transactionRepository.GetByUserIdAndPeriodAsync(input.UserId, input.Year, input.Month)).ToList();
        var budgets = (await budgetRepository.GetByPeriodAndUserAsync(input.UserId, input.Month, input.Year)).ToList();
        var categories = (await categoryRepository.GetByUserIdAsync(input.UserId)).ToList();

        var categoryNamesById = categories.ToDictionary(c => c.Id, c => c.Name);

        var totalIncome = transactions
            .Where(t => t.Type == FinancialTransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpense = transactions
            .Where(t => t.Type == FinancialTransactionType.Expense)
            .Sum(t => t.Amount);

        var transactionDtos = transactions
            .Select(t => new MonthlyReportTransactionDto(
                t.TransactionDate,
                t.Description,
                t.TransactionCategoryId.HasValue && categoryNamesById.TryGetValue(t.TransactionCategoryId.Value, out var categoryName)
                    ? categoryName
                    : "Sem categoria",
                t.Type,
                t.Amount,
                t.Recurrence))
            .ToList();

        var expensesByCategoryId = transactions
            .Where(t => t.Type == FinancialTransactionType.Expense && t.TransactionCategoryId.HasValue)
            .GroupBy(t => t.TransactionCategoryId!.Value)
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var budgetsByCategoryId = budgets.ToDictionary(b => b.TransactionCategoryId);

        var categorySummary = categories
            .Select(category =>
            {
                var totalSpent = expensesByCategoryId.GetValueOrDefault(category.Id, 0m);
                var budgetLimit = budgetsByCategoryId.TryGetValue(category.Id, out var budget) ? budget.LimitAmount : 0m;
                var percentage = budgetLimit == 0 ? 0 : (totalSpent / budgetLimit) * 100m;
                var status = budgetLimit == 0
                    ? (BudgetStatus?)null
                    : percentage >= 100m
                        ? BudgetStatus.Exceeded
                        : percentage >= 80m
                            ? BudgetStatus.Warning
                            : BudgetStatus.Ok;

                return new MonthlyReportCategorySummaryDto(category.Name, totalSpent, percentage, budgetLimit, status);
            })
            .ToList();

        return new MonthlyReportDto(
            input.Month,
            input.Year,
            user.Name,
            totalIncome,
            totalExpense,
            totalIncome - totalExpense,
            transactionDtos,
            categorySummary);
    }
}
