using FluentValidation;
using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using DomainBudget = SmartBudgetPro.Domain.Budgets.Budget;

namespace SmartBudgetPro.Application.UseCases.Budget.CreateBudget;

public class CreateBudgetUseCase(
    IBudgetRepository budgetRepository,
    IUserRepository userRepository,
    ITransactionCategoryRepository transactionCategoryRepository,
    IValidator<CreateBudgetUseCaseInput> validator)
{
    public async Task<BudgetDto> ExecuteAsync(CreateBudgetUseCaseInput input)
    {
        await validator.ValidateAndThrowAsync(input);

        var user = await userRepository.GetByIdAsync(input.UserId);

        if (user is null)
            throw new UserNotFoundException();

        var category = await transactionCategoryRepository.GetByIdAsync(input.TransactionCategoryId);

        if (category is null)
            throw new CategoryNotFoundException();

        if (category.UserId != input.UserId)
            throw new CategoryOwnershipException();

        var existingBudget = await budgetRepository.GetByUserCategoryAndPeriodAsync(
            input.UserId,
            input.TransactionCategoryId,
            input.Year,
            input.Month);

        if (existingBudget is not null)
            throw new BudgetAlreadyExistsException();

        var budget = DomainBudget.Create(
            input.UserId,
            input.TransactionCategoryId,
            input.Year,
            input.Month,
            input.LimitAmount);

        await budgetRepository.AddAsync(budget);

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