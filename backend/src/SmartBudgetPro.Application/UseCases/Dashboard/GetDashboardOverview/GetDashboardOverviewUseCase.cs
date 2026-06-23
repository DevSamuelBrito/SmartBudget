using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Budgets;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Application.UseCases.Dashboard.GetDashboardOverview;

public class GetDashboardOverviewUseCase(
    IFinancialTransactionRepository financialTransactionRepository,
    ITransactionCategoryRepository transactionCategoryRepository,
    IBudgetRepository budgetRepository,
    IUserRepository userRepository)
{
    public async Task<GetDashboardOverviewUseCaseOutput> ExecuteAsync(GetDashboardOverviewUseCaseInput input)
    {
        var now = DateTime.UtcNow;
        var targetMonth = input.Month ?? now.Month;
        var targetYear = input.Year ?? now.Year;

        if (targetMonth is < 1 or > 12)
            throw new InvalidDashboardParameterException("Month must be between 1 and 12.");

        if (targetYear is < 2000 or > 2100)
            throw new InvalidDashboardParameterException("Year is out of supported range.");

        if (input.LatestTransactionsCount < 1 || input.LatestTransactionsCount > 100)
            throw new InvalidDashboardParameterException("LatestTransactionsCount must be between 1 and 100.");

        if (input.HistoryMonths < 1 || input.HistoryMonths > 36)
            throw new InvalidDashboardParameterException("HistoryMonths must be between 1 and 36.");

        if (!input.UserId.HasValue)
            throw new MissingUserContextException();

        var user = await userRepository.GetByIdAsync(input.UserId.Value);

        if (user is null)
            throw new UserNotFoundException();

        var allTransactions = (await financialTransactionRepository.GetByUserIdAsync(input.UserId.Value)).ToList();
        var allCategories = (await transactionCategoryRepository.GetByUserIdAsync(input.UserId.Value)).ToList();
        var allBudgets = (await budgetRepository.GetByUserIdAsync(input.UserId.Value)).ToList();

        var categoryById = allCategories.ToDictionary(category => category.Id, category => category);

        var periodStart = new DateTime(targetYear, targetMonth, 1);
        var periodEndExclusive = periodStart.AddMonths(1);

        var monthTransactions = allTransactions
            .Where(t => t.TransactionDate >= periodStart && t.TransactionDate < periodEndExclusive)
            .ToList();

        var (totalIncome, totalExpense, monthIncome, monthExpense) = CalculateKpis(allTransactions, monthTransactions);

        var financialRisk = CalculateFinancialRisk(allTransactions, periodStart, targetYear, targetMonth);

        var latestTransactions = BuildLatestTransactions(allTransactions, categoryById, input.LatestTransactionsCount);

        var categoryExpenses = BuildCategoryExpenses(monthTransactions, monthExpense, categoryById);

        var monthBuckets = BuildMonthBuckets(allTransactions);

        var incomeVsExpenseByMonth = BuildIncomeVsExpenseByMonth(monthBuckets, periodStart, input.HistoryMonths);

        var balanceEvolution = BuildBalanceEvolution(allTransactions, periodStart, targetYear, targetMonth);

        var budgetProgress = BuildBudgetProgress(allBudgets, categoryById, targetMonth, targetYear);

        var alerts = BuildAlerts(budgetProgress);

        var expenseEvolutionByMonth = user.IsPremium
            ? BuildExpenseEvolutionByMonth(monthBuckets, periodStart)
            : null;

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
            FinancialRisk: new DashboardFinancialRiskDto(
                financialRisk.AverageIncome,
                financialRisk.FixedExpenses,
                financialRisk.Percentage,
                financialRisk.Status),
            LatestTransactions: latestTransactions,
            CategoryExpenses: categoryExpenses,
            CategoryExpensePie: categoryExpenses,
            IncomeVsExpenseByMonth: incomeVsExpenseByMonth,
            BalanceEvolution: balanceEvolution,
            BudgetProgress: budgetProgress,
            Alerts: alerts,
            ExpenseEvolutionByMonth: expenseEvolutionByMonth);
    }

    private static (decimal TotalIncome, decimal TotalExpense, decimal MonthIncome, decimal MonthExpense) CalculateKpis(
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> allTransactions,
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> monthTransactions)
    {
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

        return (totalIncome, totalExpense, monthIncome, monthExpense);
    }

    private static List<DashboardLatestTransactionDto> BuildLatestTransactions(
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> allTransactions,
        Dictionary<Guid, SmartBudgetPro.Domain.Transactions.TransactionCategory> categoryById,
        int latestTransactionsCount)
    {
        return allTransactions
            .OrderByDescending(t => t.TransactionDate)
            .ThenByDescending(t => t.CreatedAt)
            .Take(latestTransactionsCount)
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
    }

    private static List<DashboardCategoryExpenseDto> BuildCategoryExpenses(
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> monthTransactions,
        decimal monthExpense,
        Dictionary<Guid, SmartBudgetPro.Domain.Transactions.TransactionCategory> categoryById)
    {
        return monthTransactions
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
    }

    private static Dictionary<(int Year, int Month), (decimal Income, decimal Expense)> BuildMonthBuckets(
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> allTransactions)
    {
        return allTransactions
            .GroupBy(t => new { t.TransactionDate.Year, t.TransactionDate.Month })
            .ToDictionary(
                group => (group.Key.Year, group.Key.Month),
                group => (
                    Income: group.Where(t => t.Type == FinancialTransactionType.Income).Sum(t => t.Amount),
                    Expense: group.Where(t => t.Type == FinancialTransactionType.Expense).Sum(t => t.Amount)
                ));
    }

    private static List<DashboardIncomeExpenseByMonthDto> BuildIncomeVsExpenseByMonth(
        Dictionary<(int Year, int Month), (decimal Income, decimal Expense)> monthBuckets,
        DateTime periodStart,
        int historyMonths)
    {
        var incomeVsExpenseByMonth = new List<DashboardIncomeExpenseByMonthDto>(historyMonths);

        for (var i = historyMonths - 1; i >= 0; i--)
        {
            var monthDate = periodStart.AddMonths(-i);

            var hasBucket = monthBuckets.TryGetValue((monthDate.Year, monthDate.Month), out var bucket);

            incomeVsExpenseByMonth.Add(new DashboardIncomeExpenseByMonthDto(
                monthDate.Year,
                monthDate.Month,
                hasBucket ? bucket.Income : 0m,
                hasBucket ? bucket.Expense : 0m));
        }

        return incomeVsExpenseByMonth;
    }

    private static List<DashboardBalanceEvolutionPointDto> BuildBalanceEvolution(
        List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> allTransactions,
        DateTime periodStart,
        int targetYear,
        int targetMonth)
    {
        var periodEndExclusive = periodStart.AddMonths(1);

        var monthTransactions = allTransactions
            .Where(t => t.TransactionDate >= periodStart && t.TransactionDate < periodEndExclusive)
            .ToList();

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

        return balanceEvolution;
    }

    private static List<DashboardBudgetProgressDto> BuildBudgetProgress(
        List<SmartBudgetPro.Domain.Budgets.Budget> allBudgets,
        Dictionary<Guid, SmartBudgetPro.Domain.Transactions.TransactionCategory> categoryById,
        int targetMonth,
        int targetYear)
    {
        return allBudgets
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
    }

    private static List<DashboardAlertDto> BuildAlerts(List<DashboardBudgetProgressDto> budgetProgress)
    {
        return budgetProgress
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
    }

    private static (decimal AverageIncome, decimal FixedExpenses, decimal Percentage, string Status) CalculateFinancialRisk(
            List<SmartBudgetPro.Domain.Transactions.FinancialTransaction> allTransactions,
            DateTime periodStart,
            int targetYear,
            int targetMonth)
    {
        var financialRiskIncomeStart = periodStart.AddMonths(-2);
        var financialRiskIncomeEndExclusive = periodStart.AddMonths(1);

        var averageIncome = allTransactions
            .Where(t => t.Type == FinancialTransactionType.Income)
            .Where(t => t.TransactionDate >= financialRiskIncomeStart && t.TransactionDate < financialRiskIncomeEndExclusive)
            .Sum(t => t.Amount) / 3m;

        var fixedExpenses = allTransactions
            .Where(t => t.Type == FinancialTransactionType.Expense)
            .Where(t => t.Recurrence == RecurrenceType.Monthly)
            .Where(t => t.TransactionDate.Year == targetYear && t.TransactionDate.Month == targetMonth)
            .Sum(t => t.Amount);

        var percentage = averageIncome == 0m
            ? 0m
            : (fixedExpenses / averageIncome) * 100m;

        var status = averageIncome == 0m
            ? "NoData"
            : percentage > 70m
                ? "FinancialRisk"
                : "Ok";

        return (averageIncome, fixedExpenses, percentage, status);
    }

    private static List<DashboardExpenseByMonthDto>? BuildExpenseEvolutionByMonth(
        Dictionary<(int Year, int Month), (decimal Income, decimal Expense)> monthBuckets,
        DateTime periodStart)
    {
        const int expenseEvolutionMonths = 6;
        var expenseEvolutionByMonth = new List<DashboardExpenseByMonthDto>(expenseEvolutionMonths);

        for (var i = expenseEvolutionMonths - 1; i >= 0; i--)
        {
            var monthDate = periodStart.AddMonths(-i);
            var hasBucket = monthBuckets.TryGetValue((monthDate.Year, monthDate.Month), out var bucket);

            expenseEvolutionByMonth.Add(new DashboardExpenseByMonthDto(
                monthDate.Year,
                monthDate.Month,
                hasBucket ? bucket.Expense : 0m));
        }

        return expenseEvolutionByMonth;
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
