using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;

public class GetDashboardOverviewUseCase(
    IFinancialTransactionRepository financialTransactionRepository,
    ITransactionCategoryRepository transactionCategoryRepository,
    IBudgetRepository budgetRepository)
{
    public async Task<GetDashboardOverviewUseCaseOutput> ExecuteAsync(GetDashboardOverviewUseCaseInput input)
    {
        var now = DateTime.UtcNow;
        var targetMonth = input.Month ?? now.Month;
        var targetYear = input.Year ?? now.Year;

        if (targetMonth is < 1 or > 12)
            throw new ArgumentOutOfRangeException(nameof(input.Month), "Month must be between 1 and 12.");

        if (targetYear is < 2000 or > 2100)
            throw new ArgumentOutOfRangeException(nameof(input.Year), "Year is out of supported range.");

        if (input.LatestTransactionsCount < 1 || input.LatestTransactionsCount > 100)
            throw new ArgumentOutOfRangeException(nameof(input.LatestTransactionsCount), "LatestTransactionsCount must be between 1 and 100.");

        if (input.HistoryMonths < 1 || input.HistoryMonths > 36)
            throw new ArgumentOutOfRangeException(nameof(input.HistoryMonths), "HistoryMonths must be between 1 and 36.");

        if (!input.UserId.HasValue)
            throw new UnauthorizedAccessException("UserId is required.");

        var allTransactions = (await financialTransactionRepository.GetByUserIdAsync(input.UserId.Value)).ToList();
        var allCategories = (await transactionCategoryRepository.GetByUserIdAsync(input.UserId.Value)).ToList();
        var allBudgets = (await budgetRepository.GetByUserIdAsync(input.UserId.Value)).ToList();

        var categoryById = allCategories.ToDictionary(category => category.Id, category => category);

        var periodStart = new DateTime(targetYear, targetMonth, 1);
        var periodEndExclusive = periodStart.AddMonths(1);

        var monthTransactions = allTransactions
            .Where(t => t.TransactionDate >= periodStart && t.TransactionDate < periodEndExclusive)
            .ToList();

        var totalIncome = allTransactions
            .Where(t => t.Type == FinancialTransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpense = allTransactions
            .Where(t => t.Type == FinancialTransactionType.Expense)
            .Sum(t => t.Amount);

        var monthIncome = monthTransactions
            .Where(t => t.Type == FinancialTransactionType.Income)
            .Sum(t => t.Amount);

        var monthExpense = monthTransactions
            .Where(t => t.Type == FinancialTransactionType.Expense)
            .Sum(t => t.Amount);

        var latestTransactions = allTransactions
            .OrderByDescending(t => t.TransactionDate)
            .ThenByDescending(t => t.CreatedAt)
            .Take(input.LatestTransactionsCount)
            .Select(t =>
            {
                SmartBudgetPro.Domain.Transactions.TransactionCategory? category = null;
                if (t.TransactionCategoryId.HasValue)
                    categoryById.TryGetValue(t.TransactionCategoryId.Value, out category);

                return new DashboardLatestTransactionDto(
                    t.Id,
                    t.UserId,
                    t.TransactionCategoryId,
                    category?.Name,
                    category?.Icon,
                    t.Amount,
                    t.TransactionDate,
                    t.Type,
                    t.Description);
            })
            .ToList();

        var categoryExpenses = monthTransactions
            .Where(t => t.Type == FinancialTransactionType.Expense)
            .GroupBy(t => t.TransactionCategoryId)
            .Select(group =>
            {
                var amount = group.Sum(t => t.Amount);
                var categoryId = group.Key;

                var category = categoryId.HasValue && categoryById.TryGetValue(categoryId.Value, out var foundCategory)
                    ? foundCategory
                    : null;

                var percentage = monthExpense == 0m
                    ? 0m
                    : (amount / monthExpense) * 100m;

                return new DashboardCategoryExpenseDto(
                    categoryId,
                    category?.Name ?? "Sem categoria",
                    category?.Icon ?? string.Empty,
                    amount,
                    percentage);
            })
            .OrderByDescending(c => c.Amount)
            .ToList();

        var monthBuckets = allTransactions
            .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
            .ToDictionary(
                group => (group.Key.Year, group.Key.Month),
                group => new
                {
                    Income = group.Where(t => t.Type == FinancialTransactionType.Income).Sum(t => t.Amount),
                    Expense = group.Where(t => t.Type == FinancialTransactionType.Expense).Sum(t => t.Amount)
                });

        var incomeVsExpenseByMonth = new List<DashboardIncomeExpenseByMonthDto>(input.HistoryMonths);
        for (var i = input.HistoryMonths - 1; i >= 0; i--)
        {
            var monthDate = periodStart.AddMonths(-i);

            var hasBucket = monthBuckets.TryGetValue((monthDate.Year, monthDate.Month), out var bucket);

            incomeVsExpenseByMonth.Add(new DashboardIncomeExpenseByMonthDto(
                monthDate.Year,
                monthDate.Month,
                hasBucket ? bucket!.Income : 0m,
                hasBucket ? bucket!.Expense : 0m));
        }

        var balanceUntilPeriodStart = allTransactions
            .Where(t => t.TransactionDate < periodStart)
            .Sum(ToSignedAmount);

        var dailyNetByDate = monthTransactions
            .GroupBy(t => t.TransactionDate.Date)
            .ToDictionary(group => group.Key, group => group.Sum(ToSignedAmount));

        var daysInMonth = DateTime.DaysInMonth(targetYear, targetMonth);
        var runningBalance = balanceUntilPeriodStart;
        var balanceEvolution = new List<DashboardBalanceEvolutionPointDto>(daysInMonth);

        for (var day = 1; day <= daysInMonth; day++)
        {
            var date = new DateTime(targetYear, targetMonth, day);

            if (dailyNetByDate.TryGetValue(date, out var dailyNet))
                runningBalance += dailyNet;

            balanceEvolution.Add(new DashboardBalanceEvolutionPointDto(date, runningBalance));
        }

        var budgetProgress = allBudgets
            .Where(b => b.Month == targetMonth && b.Year == targetYear)
            .Select(budget =>
            {
                var hasCategory = categoryById.TryGetValue(budget.TransactionCategoryId, out var category);
                var percentage = budget.LimitAmount == 0m
                    ? 0m
                    : (budget.SpentAmount / budget.LimitAmount) * 100m;

                return new DashboardBudgetProgressDto(
                    budget.Id,
                    budget.TransactionCategoryId,
                    hasCategory ? category!.Name : "Categoria",
                    hasCategory ? category!.Icon : string.Empty,
                    budget.LimitAmount,
                    budget.SpentAmount,
                    budget.LimitAmount - budget.SpentAmount,
                    percentage,
                    budget.Status);
            })
            .OrderByDescending(b => b.Percentage)
            .ToList();

        var alerts = budgetProgress
            .Where(b => b.Status is BudgetStatus.Warning or BudgetStatus.Exceeded || b.Percentage >= 80m)
            .Select(budget =>
            {
                var type = budget.Status == BudgetStatus.Exceeded || budget.Percentage >= 100m
                    ? "BudgetExceeded"
                    : "BudgetWarning";

                var message = type == "BudgetExceeded"
                    ? $"A categoria {budget.CategoryName} excedeu o budget mensal."
                    : $"A categoria {budget.CategoryName} atingiu {budget.Percentage:F1}% do budget mensal.";

                return new DashboardAlertDto(
                    type,
                    budget.BudgetId,
                    budget.TransactionCategoryId,
                    budget.CategoryName,
                    budget.Percentage,
                    budget.Status,
                    message);
            })
            .ToList();

        var daysDivisor = GetAverageDaysDivisor(targetYear, targetMonth, now);

        return new GetDashboardOverviewUseCaseOutput(
            targetMonth,
            targetYear,
            new DashboardKpisDto(
                CurrentBalance: totalIncome - totalExpense,
                MonthlyIncome: monthIncome,
                MonthlyExpense: monthExpense,
                MonthlySavings: monthIncome - monthExpense),
            DailyAverageIncome: monthIncome / daysDivisor,
            DailyAverageExpense: monthExpense / daysDivisor,
            LatestTransactions: latestTransactions,
            CategoryExpenses: categoryExpenses,
            CategoryExpensePie: categoryExpenses,
            IncomeVsExpenseByMonth: incomeVsExpenseByMonth,
            BalanceEvolution: balanceEvolution,
            BudgetProgress: budgetProgress,
            Alerts: alerts);
    }

    private static decimal ToSignedAmount(SmartBudgetPro.Domain.Transactions.FinancialTransaction transaction)
    {
        return transaction.Type switch
        {
            FinancialTransactionType.Income => transaction.Amount,
            FinancialTransactionType.Expense => -transaction.Amount,
            _ => 0m
        };
    }

    private static int GetAverageDaysDivisor(int year, int month, DateTime nowUtc)
    {
        var daysInMonth = DateTime.DaysInMonth(year, month);

        if (year == nowUtc.Year && month == nowUtc.Month)
            return Math.Max(1, nowUtc.Day);

        return daysInMonth;
    }
}
