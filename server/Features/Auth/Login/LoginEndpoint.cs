using server.Common.Abstractions;

namespace server.Features.Auth.Login;

public class LoginEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/auth/login",
            async (LoginRequest request, ICommandHandler<LoginRequest, AuthResponse> handler) =>
            {
                var result = await handler.Handle(request);
                return result.IsSuccess
                    ? Results.Ok(new { result.Value!.AccessToken, result.Value.RefreshToken })
                    : Results.Unauthorized();
            }).AllowAnonymous();
}