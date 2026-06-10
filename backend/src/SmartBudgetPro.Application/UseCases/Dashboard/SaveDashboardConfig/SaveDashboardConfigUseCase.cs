using FluentValidation;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

public class SaveDashboardConfigUseCase(
    IUserDashboardConfigRepository repository,
    IValidator<SaveDashboardConfigUseCaseInput> validator)
{
    public async Task ExecuteAsync(SaveDashboardConfigUseCaseInput input)
    {
        var validationResult = await validator.ValidateAsync(input);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var configs = input.Items.Select(item =>
            UserDashboardConfig.Create(
                input.UserId,
                item.ComponentKey,
                item.Order,
                item.Columns,
                item.Visible));

        await repository.SaveAsync(configs);
    }
}
