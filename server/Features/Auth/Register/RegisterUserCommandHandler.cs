using Microsoft.AspNetCore.Identity;
using server.Common;
using server.Common.Abstractions;
using server.Models;

namespace server.Features.Auth.Register;

public class RegisterUserCommandHandler(UserManager<IdentityUser> userManager)
    : ICommandHandler<RegisterUserRequest, string>
{

    public async Task<Result<string>> Handle(RegisterUserRequest request)
    {
        var user = new IdentityUser { UserName = request.Email, Email = request.Email };
        var creationResult = await userManager.CreateAsync(user, request.Password);
        if (!creationResult.Succeeded)
        {
            var errors = creationResult.Errors.Select(e => e.Description);
            return Result<string>.Failure(errors);
        }

        // For now, all users will be admin ig
        await userManager.AddToRoleAsync(user, Roles.Admin.ToString());
        return Result<string>.Success(user.Id);
    }
}