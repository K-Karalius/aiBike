using server.Common.Abstractions;

namespace server.Features.Auth.Login;

public class LoginEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/auth/login",
            async (LoginRequest request, ICommandHandler<LoginRequest, string> handler) =>
            {
                var result = await handler.Handle(request);
                return result.IsSuccess
                    ? Results.Ok(new { Token = result.Value })
                    : Results.Unauthorized();
            }).AllowAnonymous();

}