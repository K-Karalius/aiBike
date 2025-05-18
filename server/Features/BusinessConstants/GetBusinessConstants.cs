using server.Common.Abstractions;
using server.Common.Authorization;

namespace server.Features.BusinessConstants.Get;

public class GetBusinessConstants : IEndpoint
{
    public const decimal farePerMinute = 3;

    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/constants",
            () =>
            {
                return Results.Ok(new BusinessConstantsResponse() { FarePerMinute = farePerMinute });
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}