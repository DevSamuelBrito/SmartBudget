using SmartBudgetPro.Application.Common.DTOs;
using SmartBudgetPro.Application.Exceptions;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Application.UseCases.Budget.GetBudgetsByPeriod;

public class GetBudgetsByPeriodUseCase(IBudgetRepository budgetRepository)
{
    public async Task<IEnumerable<BudgetByPeriodDto>> ExecuteAsync(Guid userId, int month, int year)
    {
        if (month is < 1 or > 12)
            throw new InvalidBudgetPeriodException("Month must be between 1 and 12.");

        if (year is < 2000 or > 2100)
            throw new InvalidBudgetPeriodException("Year is out of supported range.");

        return await budgetRepository.GetByPeriodAndUserAsync(userId, month, year);
    }
}
