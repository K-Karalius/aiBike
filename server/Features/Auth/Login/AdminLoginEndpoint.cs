using server.Common.Abstractions;
using server.Models;

namespace server.Features.Auth.Login;

public class AdminLoginEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/admin/auth/login",
            async (LoginRequest request, ICommandHandler<LoginRequest, AuthResponse> handler) =>
            {
                var loginResult = await handler.Handle(request);
                if (!loginResult.IsSuccess)
                    return Results.Unauthorized();

                var authResponse = loginResult.Value!;
                return !authResponse.Roles.Contains(Roles.Admin.ToString(), StringComparer.OrdinalIgnoreCase)
                    ? Results.Unauthorized()
                    : Results.Ok(new { authResponse.AccessToken, authResponse.RefreshToken });
            }).AllowAnonymous();
}