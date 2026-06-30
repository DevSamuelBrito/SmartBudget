namespace SmartBudgetPro.Application.UseCases.Auth.ResetPassword;

public record ResetPasswordUseCaseInput(string Token, string NewPassword, string ConfirmNewPassword);
