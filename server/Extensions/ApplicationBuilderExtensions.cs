using server.Common.Abstractions;

namespace server.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication RegisterEndpoints(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var endpoints = scope.ServiceProvider.GetRequiredService<IEnumerable<IEndpoint>>();
        foreach (var endpoint in endpoints)
        {
            var route = endpoint.MapEndpoint(app);
            route.WithOpenApi();
        }

        return app;
    }
}