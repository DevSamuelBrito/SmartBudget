using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;

public class DeleteBudgetUseCase(IBudgetRepository budgetRepository)
{
    public async Task ExecuteAsync(Guid userId, Guid budgetId)
    {
        var budget = await budgetRepository.GetByIdAsync(budgetId);

        if (budget is null)
            throw new InvalidOperationException("Budget not found.");

        if (budget.UserId != userId)
            throw new UnauthorizedAccessException("This budget does not belong to the authenticated user.");

        await budgetRepository.DeleteAsync(budgetId);
    }
}