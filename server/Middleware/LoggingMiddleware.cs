using System.Security.Claims;
using Microsoft.Extensions.Options;
using Serilog;
using server.Configuration;

namespace server.Middleware;

public class LoggingMiddleware(RequestDelegate requestDelegate, IOptionsMonitor<LoggingInterceptorOptions> optionsMonitor)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        if (!optionsMonitor.CurrentValue.Enabled)
        {
            await requestDelegate(httpContext);
            return;
        }

        var userName = httpContext.User.Identity?.Name;
        if (string.IsNullOrEmpty(userName))
            userName = "Anonymous";

        var roleClaims = httpContext.User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToArray();
        var hasRoles = roleClaims.Length > 0;
        var rolesText = hasRoles ? string.Join(",", roleClaims) : string.Empty;

        var routeName = httpContext.GetEndpoint()?.DisplayName ?? httpContext.Request.Path;
        var httpMethod = httpContext.Request.Method;
        var timestampUtc = DateTime.UtcNow;

        var log = Log.ForContext("UserName", userName);
        if (hasRoles)
            log = log.ForContext("Roles", roleClaims, destructureObjects: true);

        log.Information(
            "{HttpMethod} {RouteName} invoked by {UserName}{RolesClause} at {TimestampUtc}",
            httpMethod,
            routeName,
            userName,
            hasRoles ? $" (roles: {rolesText})" : string.Empty,
            timestampUtc
        );

        await requestDelegate(httpContext);
    }
}