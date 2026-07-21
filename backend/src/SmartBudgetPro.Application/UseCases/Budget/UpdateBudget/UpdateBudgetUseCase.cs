using FluentValidation;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.UpdateBudget;

public class UpdateBudgetUseCase(
    IBudgetRepository budgetRepository,
    IValidator<UpdateBudgetUseCaseInput> validator,
    IAuditLogger auditLogger)
{
    public async Task ExecuteAsync(Guid userId, Guid id, UpdateBudgetUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var budget = await budgetRepository.GetByIdAsync(id);

        if (budget is null)
            throw new BudgetNotFoundException();

        if (budget.UserId != userId)
            throw new BudgetOwnershipException();

        budget.UpdateLimit(input.LimitAmount);

        await budgetRepository.UpdateAsync(budget);

        await auditLogger.LogAsync(
            userId,
            "BudgetUpdated",
            "Budget",
            budget.Id,
            null);
    }
}