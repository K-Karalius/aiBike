using Microsoft.AspNetCore.Identity;
using server.Common.Abstractions;

namespace server.Seeders;

public class UserSeeder(string email, string password, IEnumerable<string> roles) : ISeeder
{
    public async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            return;
        }

        var user = new IdentityUser { UserName = email, Email = email };
        var creationResult = await userManager.CreateAsync(user, password);
        if (!creationResult.Succeeded)
        {
            return;
        }

        foreach (var roleName in roles)
        {
            if (await roleManager.RoleExistsAsync(roleName))
            {
                await userManager.AddToRoleAsync(user, roleName);
            }
        }
    }
}