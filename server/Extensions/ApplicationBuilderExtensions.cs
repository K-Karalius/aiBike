using server.Common.Abstractions;

namespace server.Extensions;

public static class ApplicationBuilderExtensions
{
    public static void RegisterEndpoints(this WebApplication app)
    {
        var endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>();
        foreach (var endpoint in endpoints)
        {
            var route = endpoint.MapEndpoint(app);
            route.WithOpenApi();
        }
    }
}