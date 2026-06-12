using SmartBudgetPro.Shared.Exceptions;

namespace SmartBudgetPro.Domain.Budgets;

public class Budget
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid TransactionCategoryId { get; private set; }
    public int Year { get; private set; }
    public int Month { get; private set; }
    public decimal LimitAmount { get; private set; }
    public decimal SpentAmount { get; private set; }
    public BudgetStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Budget() { } // For EF Core

    private Budget(Guid userId, Guid transactionCategoryId, int year, int month, decimal limitAmount)
    {
        if (userId == Guid.Empty)
            throw new BusinessBadRequestException("Invalid userId.");

        if (transactionCategoryId == Guid.Empty)
            throw new BusinessBadRequestException("Invalid category id.");

        if (year < 2000 || year > 2100)
            throw new ArgumentOutOfRangeException(nameof(year), "Year is out of supported range.");

        if (month is < 1 or > 12)
            throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");

        if (limitAmount <= 0)
            throw new BusinessBadRequestException("Budget limit must be greater than zero.");
            
        UserId = userId;
        TransactionCategoryId = transactionCategoryId;
        Year = year;
        Month = month;
        LimitAmount = limitAmount;
        SpentAmount = 0m;
        Status = BudgetStatus.Ok;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static Budget Create(Guid userId, Guid transactionCategoryId, int year, int month, decimal limitAmount)
    {
        return new Budget(userId, transactionCategoryId, year, month, limitAmount);
    }

    public bool MatchesPeriodAndCategory(Guid transactionCategoryId, int year, int month)
    {
        return TransactionCategoryId == transactionCategoryId && Year == year && Month == month;
    }

    public void UpdateLimit(decimal newLimitAmount)
    {
        if (newLimitAmount <= 0)
            throw new BusinessBadRequestException("Budget limit must be greater than zero.");

        LimitAmount = newLimitAmount;
        RecalculateStatus();
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecalculateFromExpenses(decimal totalExpenseAmount)
    {
        if (totalExpenseAmount < 0)
            throw new BusinessBadRequestException("Spent amount cannot be negative.");

        SpentAmount = totalExpenseAmount;
        RecalculateStatus();
        UpdatedAt = DateTime.UtcNow;
    }

    private void RecalculateStatus()
    {
        var percentage = LimitAmount == 0 ? 0 : (SpentAmount / LimitAmount) * 100m;

        if (percentage >= 100m)
        {
            Status = BudgetStatus.Exceeded;
            return;
        }

        if (percentage >= 80m)
        {
            Status = BudgetStatus.Warning;
            return;
        }

        Status = BudgetStatus.Ok;
    }
}