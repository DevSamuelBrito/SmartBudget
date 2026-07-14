using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using SmartBudgetPro.Application.Interfaces;
using SmartBudgetPro.Infrastructure.Email.Templates;

namespace SmartBudgetPro.Infrastructure.Email;

public class BrevoEmailService(HttpClient httpClient, IConfiguration configuration) : IEmailService
{
    private const string ApiUrl = "https://api.brevo.com/v3/smtp/email";

    public async Task SendPasswordResetEmailAsync(string toEmail, string toName, string resetLink)
    {
        var apiKey = configuration["Email:ApiKey"] ?? throw new InvalidOperationException("Email:ApiKey is not configured.");
        var fromEmail = configuration["Email:FromEmail"] ?? throw new InvalidOperationException("Email:FromEmail is not configured.");
        var fromName = configuration["Email:FromName"] ?? "SmartBudget";

        var payload = new
        {
            sender = new { name = fromName, email = fromEmail },
            to = new[] { new { name = toName, email = toEmail } },
            subject = "Reset your SmartBudget password",
            htmlContent = EmailTemplateBuilder.BuildPasswordResetEmail(toName, resetLink, "30")
        };

        var json = JsonSerializer.Serialize(payload);
        using var request = new HttpRequestMessage(HttpMethod.Post, ApiUrl);
        request.Headers.Add("api-key", apiKey);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}
