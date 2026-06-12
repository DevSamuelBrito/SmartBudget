using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;

public class DeleteBudgetUseCase(IBudgetRepository budgetRepository)
{
    public async Task ExecuteAsync(Guid userId, Guid budgetId)
    {
        var budget = await budgetRepository.GetByIdAsync(budgetId);

        if (budget is null)
            throw new BudgetNotFoundException();

        if (budget.UserId != userId)
            throw new BudgetOwnershipException();

        await budgetRepository.DeleteAsync(budgetId);
    }
}