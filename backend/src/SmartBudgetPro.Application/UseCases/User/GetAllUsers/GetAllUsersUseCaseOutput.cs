namespace SmartBudgetPro.Application.UseCases.User.GetAllUsers;

public record class GetAllUsersUseCaseOutput
(
    Guid UserId,
    string Name,
    string Email
);
