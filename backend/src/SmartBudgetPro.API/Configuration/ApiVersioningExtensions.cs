using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace SmartBudgetPro.API.Configuration;

public static class ApiVersioningExtensions
{
    private const string VersionedRoutePrefix = "api/v{version:apiVersion}";

    public static IServiceCollection AddApiVersioningSupport(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        });

        return services;
    }

    public static void AddVersionedApiConvention(this MvcOptions options)
    {
        options.Conventions.Add(new VersionedApiConvention(VersionedRoutePrefix));
    }

    private sealed class VersionedApiConvention(string routePrefix) : IApplicationModelConvention
    {
        private readonly AttributeRouteModel _routePrefix = new(new RouteAttribute(routePrefix));

        public void Apply(ApplicationModel application)
        {
            foreach (var controller in application.Controllers)
            {
                foreach (var selector in controller.Selectors)
                {
                    if (selector.AttributeRouteModel is null)
                    {
                        continue;
                    }

                    selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                        _routePrefix,
                        selector.AttributeRouteModel);
                }
            }
        }
    }
}