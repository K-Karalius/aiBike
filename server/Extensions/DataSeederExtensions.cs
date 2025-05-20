using server.Common.Abstractions;
using server.Seeders;

namespace server.Extensions;

public static class DataSeederExtensions
{
    public static IServiceCollection AddDataSeeders(this IServiceCollection services)
    {
        services.AddScoped<ISeeder>(_ =>
            new RoleSeeder(["ADMIN", "USER"]));
        services.AddScoped<ISeeder>(_ =>
            new UserSeeder("admin@aibike.com", "AdminP@ssw0rd", ["ADMIN"]));
        return services;
    }

    public static async Task SeedDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var seeders = scope.ServiceProvider.GetServices<ISeeder>();
        foreach (var seeder in seeders)
            await seeder.SeedAsync(scope.ServiceProvider);
    }
}