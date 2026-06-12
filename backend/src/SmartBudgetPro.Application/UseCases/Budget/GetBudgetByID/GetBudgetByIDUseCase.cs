using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.GetBudgetByID;

public class GetBudgetByIDUseCase(IBudgetRepository budgetRepository)
{
    public async Task<BudgetDto> ExecuteAsync(Guid userId, Guid budgetId)
    {
        var budget = await budgetRepository.GetByIdAsync(budgetId);

        if (budget is null)
            throw new BudgetNotFoundException();

        if (budget.UserId != userId)
            throw new BudgetOwnershipException();

        return new BudgetDto(
            budget.Id,
            budget.UserId,
            budget.TransactionCategoryId,
            budget.Year,
            budget.Month,
            budget.LimitAmount,
            budget.SpentAmount,
            budget.Status,
            budget.CreatedAt,
            budget.UpdatedAt);
    }
}