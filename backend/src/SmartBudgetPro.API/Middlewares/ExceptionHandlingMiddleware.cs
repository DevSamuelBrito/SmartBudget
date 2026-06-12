using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace SmartBudgetPro.API.Middlewares;

public class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger,
    IProblemDetailsService problemDetailsService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while processing the request.");
            await HandleExceptionAsync(context, ex, problemDetailsService);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception,
        IProblemDetailsService problemDetailsService)
    {
        var (statusCode, message) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                string.Join(", ", validationEx.Errors.Select(e => e.ErrorMessage))
            ),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, exception.Message),
            InvalidOperationException => (StatusCodes.Status409Conflict, exception.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };

        var problemDetails = new ProblemDetails
        {
            Type = $"https://httpstatuses.com/{statusCode}",
            Title = ReasonPhrases.GetReasonPhrase(statusCode),
            Status = statusCode,
            Detail = message,
            Instance = context.Request.Path
        };
        problemDetails.Extensions["timestamp"] = DateTime.UtcNow;

        context.Response.StatusCode = statusCode;

        var wasWritten = await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = context,
            ProblemDetails = problemDetails
        });

        if (!wasWritten)
        {
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}