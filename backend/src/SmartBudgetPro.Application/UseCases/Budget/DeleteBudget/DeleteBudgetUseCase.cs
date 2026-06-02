using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.DeleteBudget;

public class DeleteBudgetUseCase(IBudgetRepository budgetRepository)
{
    public async Task ExecuteAsync(Guid budgetId)
    {
        await budgetRepository.DeleteAsync(budgetId);
    }
}