namespace SmartBudgetPro.Infrastructure.Email.Templates;

public static class EmailTemplateBuilder
{
    public static string BuildPasswordResetEmail(string toName, string resetLink, string expirationMinutes) => $"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hi {toName},</p>
            <p>We received a request to reset the password for your SmartBudget account.</p>
            <p>Click the button below to reset your password. This link is valid for <strong>{expirationMinutes} minutes</strong>.</p>
            <p style="margin: 24px 0;">
              <a href="{resetLink}"
                 style="background-color: #4F46E5; color: white; padding: 12px 24px;
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>— The SmartBudget Team</p>
          </body>
        </html>
        """;
}
