using FluentValidation;
using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

public class SaveDashboardConfigUseCase(
    IUserDashboardConfigRepository repository,
    IUserRepository userRepository,
    IValidator<SaveDashboardConfigUseCaseInput> validator)
{
    public async Task ExecuteAsync(SaveDashboardConfigUseCaseInput input)
    {
        var validationResult = await validator.ValidateAsync(input);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var user = await userRepository.GetByIdAsync(input.UserId);

        if (user is null)
            throw new UserNotFoundException();

        var hasVisiblePremiumComponent = input.Items.Any(item =>
            item.Visible && PremiumFeatures.DashboardComponentKeys.Contains(item.ComponentKey));

        if (hasVisiblePremiumComponent && !user.IsPremium)
            throw new PremiumPlanRequiredException("Premium plan required to use this dashboard component.");

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
