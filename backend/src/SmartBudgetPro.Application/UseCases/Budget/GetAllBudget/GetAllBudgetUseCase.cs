using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.GetAllBudget;

public class GetAllBudgetUseCase(IBudgetRepository budgetRepository)
{
    public async Task<IEnumerable<BudgetDto>> ExecuteAsync()
    {
        var budgets = await budgetRepository.GetAllAsync();

        return budgets.Select(b => new BudgetDto(
            b.Id,
            b.UserId,
            b.TransactionCategoryId,
            b.Year,
            b.Month,
            b.LimitAmount,
            b.SpentAmount,
            b.Status,
            b.CreatedAt,
            b.UpdatedAt));
    }
}