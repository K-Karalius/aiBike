using Microsoft.AspNetCore.Identity;
using server.Common.Abstractions;

namespace server.Seeders;

public class RoleSeeder(IEnumerable<string> rolesToEnsure) : ISeeder
{
    public async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var roleName in rolesToEnsure)
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
    }
}