using server.Common.Abstractions;
using server.Common.Authorization;
using server.Models;

namespace server.Features.Auth.Register;

public class AdminRegisterEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/admin/auth/register",
            async (RegisterUserRequest request, ICommandHandler<RegisterUserRequest, string> handler) =>
            {
                request = request with { Role = Roles.Admin };
                var result = await handler.Handle(request);
                return result.IsSuccess
                    ? Results.Ok(new { UserId = result.Value })
                    : Results.BadRequest(new { result.Errors });
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}