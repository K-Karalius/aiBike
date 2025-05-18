using server.Common.Abstractions;

namespace server.Features.Auth.Login;

public class RefreshEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/auth/refresh",
            async (RefreshTokenRequest request, ICommandHandler<RefreshTokenRequest, AuthResponse> handler) =>
            {
                var result = await handler.Handle(request);
                return result.IsSuccess
                    ? Results.Ok(new { result.Value!.AccessToken, result.Value.RefreshToken })
                    : Results.Unauthorized();
            }).AllowAnonymous();
}