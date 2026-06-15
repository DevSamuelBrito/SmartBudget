using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Transactions;

namespace SmartBudgetPro.Infrastructure.Jobs;

public class RecurringTransactionJob(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<RecurringTransactionJob> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Recurring transaction job started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;
            var nextExecution = GetNextExecution(now);

            logger.LogInformation(
                "Recurring transaction job scheduled to run at {NextExecution}.",
                nextExecution);

            await DelayUntilAsync(nextExecution, stoppingToken);

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            await ProcessRecurringTransactionsAsync(stoppingToken);
        }
    }

    private static DateTime GetNextExecution(DateTime now)
    {
        var firstDayOfCurrentMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Local);

        return now < firstDayOfCurrentMonth
            ? firstDayOfCurrentMonth
            : firstDayOfCurrentMonth.AddMonths(1);
    }

    private static async Task DelayUntilAsync(DateTime targetTime, CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var remaining = targetTime - DateTime.Now;

            if (remaining <= TimeSpan.Zero)
            {
                break;
            }

            var delay = remaining > TimeSpan.FromHours(12)
                ? TimeSpan.FromHours(12)
                : remaining;

            await Task.Delay(delay, cancellationToken);
        }
    }

    private async Task ProcessRecurringTransactionsAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();

        var transactionRepository = scope.ServiceProvider.GetRequiredService<IFinancialTransactionRepository>();
        var budgetRepository = scope.ServiceProvider.GetRequiredService<IBudgetRepository>();

        var nextMonth = DateTime.UtcNow.AddMonths(1);
        var currentYear = nextMonth.Year;
        var currentMonth = nextMonth.Month;

        var recurringTransactions = await transactionRepository.GetAllMonthlyRecurringAsync();

        foreach (var transaction in recurringTransactions)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var occurrenceAlreadyExists = await transactionRepository.ExistsOccurrenceForMonthAsync(
                    transaction.Id,
                    currentYear,
                    currentMonth);

                if (occurrenceAlreadyExists)
                {
                    continue;
                }

                var day = Math.Min(transaction.TransactionDate.Day, DateTime.DaysInMonth(currentYear, currentMonth));
                var nextDate = new DateTime(
                    currentYear,
                    currentMonth,
                    day,
                    transaction.TransactionDate.Hour,
                    transaction.TransactionDate.Minute,
                    transaction.TransactionDate.Second,
                    transaction.TransactionDate.Kind)
                    .AddMilliseconds(transaction.TransactionDate.Millisecond);

                var newOccurrence = transaction.GenerateNextMonthlyOccurrence(nextDate);

                await transactionRepository.AddAsync(newOccurrence);

                if (transaction.Type == FinancialTransactionType.Expense && transaction.TransactionCategoryId.HasValue)
                {
                    await RecalculateBudgetAsync(
                        budgetRepository,
                        transactionRepository,
                        transaction.UserId,
                        transaction.TransactionCategoryId.Value,
                        currentYear,
                        currentMonth);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Failed to generate recurring occurrence for transaction {TransactionId}.",
                    transaction.Id);
            }
        }
    }

    private static async Task RecalculateBudgetAsync(
        IBudgetRepository budgetRepository,
        IFinancialTransactionRepository transactionRepository,
        Guid userId,
        Guid categoryId,
        int year,
        int month)
    {
        var budget = await budgetRepository.GetByUserCategoryAndPeriodAsync(userId, categoryId, year, month);

        if (budget is null)
        {
            return;
        }

        var totalExpenses = await transactionRepository.GetTotalExpensesByCategoryAndPeriodAsync(categoryId, year, month);

        budget.RecalculateFromExpenses(totalExpenses);

        await budgetRepository.UpdateAsync(budget);
    }
}
