using FluentValidation;
using Microsoft.Extensions.Logging;
using SmartBudgetPro.Application.Common;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Domain.Dashboard;

namespace SmartBudgetPro.Application.UseCases.Dashboard.SaveDashboardConfig;

public class SaveDashboardConfigUseCase(
    IUserDashboardConfigRepository repository,
    IUserRepository userRepository,
    IValidator<SaveDashboardConfigUseCaseInput> validator,
    ILogger<SaveDashboardConfigUseCase> logger)
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
        {
            logger.LogWarning(
                "User {UserId} attempted to enable a premium dashboard component without a premium plan.",
                input.UserId);
            throw new PremiumPlanRequiredException("Premium plan required to use this dashboard component.");
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
