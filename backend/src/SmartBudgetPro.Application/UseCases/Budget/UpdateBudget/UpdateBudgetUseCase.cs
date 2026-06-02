using FluentValidation;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;

public class UpdateBudgetUseCase(
    IBudgetRepository budgetRepository,
    IValidator<UpdateBudgetUseCaseInput> validator)
{
    public async Task ExecuteAsync(Guid id, UpdateBudgetUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var budget = await budgetRepository.GetByIdAsync(id);

        if (budget is null)
            throw new InvalidOperationException("Budget not found.");

        budget.UpdateLimit(input.LimitAmount);

        await budgetRepository.UpdateAsync(budget);
    }
}