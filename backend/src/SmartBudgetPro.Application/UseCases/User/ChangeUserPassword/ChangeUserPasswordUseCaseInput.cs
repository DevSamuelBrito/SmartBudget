namespace SmartBudgetPro.Application.UseCases.User.ChangeUserPassword;

public record ChangeUserPasswordUseCaseInput(
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword
);