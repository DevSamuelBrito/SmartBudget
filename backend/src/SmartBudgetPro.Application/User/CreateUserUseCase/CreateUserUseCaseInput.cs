namespace SmartBudgetPro.Application.User.CreateUserUseCase;

public class CreateUserUseCaseInput
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
