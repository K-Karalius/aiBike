using System.Security.Claims;
using server.Models;

namespace server.Extensions;

public static class HttpContextExtensions
{
    public static string? GetCurrentUserId(this HttpContext context)
        => context.User.FindFirstValue(ClaimTypes.NameIdentifier);
    
    public static List<string> GetCurrentUserRoles(this HttpContext context)
        => context.User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();
    
    public static bool CurrentUserIsAdmin(this HttpContext context) =>
        context.User.IsInRole(Roles.Admin.ToString());
}