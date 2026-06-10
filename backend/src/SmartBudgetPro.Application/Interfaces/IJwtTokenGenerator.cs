using SmartBudgetPro.Application.Common.Security;

namespace SmartBudgetPro.Application.Interfaces;

public interface IJwtTokenGenerator
{
    JwtTokenResult Generate(Guid userId, string email, string name);
}