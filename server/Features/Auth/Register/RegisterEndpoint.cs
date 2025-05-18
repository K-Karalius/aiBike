using server.Common.Abstractions;
using server.Models;

namespace server.Features.Auth.Register;

public class RegisterEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/auth/register",
            async (RegisterUserRequest request, ICommandHandler<RegisterUserRequest, string> handler) =>
            {
                request = request with { Role = Roles.User };
                var result = await handler.Handle(request);
                return result.IsSuccess
                    ? Results.Ok(new { UserId = result.Value })
                    : Results.BadRequest(new { result.Errors });
            }).AllowAnonymous();
}