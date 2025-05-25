using server.Common.Authorization;
using server.Extensions;

namespace server.Features.Stations.GetAll;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Common.Abstractions;
using DatabaseContext;

public class GetAllStationsEndpoint : IEndpoint
{
    private const double EarthRadiusKm = 6371.0;
    private const double ToRadians = Math.PI / 180.0;

    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/station", HandleGetAllStations)
               .RequireAuthorization(AuthorizationPolicies.UserOrAdmin);

    private static async Task<IResult> HandleGetAllStations(
        ApplicationDbContext dbContext,
        [FromQuery] decimal latitude,
        [FromQuery] decimal longitude,
        [FromQuery] decimal radiusKm,
        ICommandHandler<GetAllStationsQuery, PagedResult<GetAllStationsResponse>> handler,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAllStationsQuery(latitude, longitude, radiusKm, page, pageSize);
        var result = await handler.Handle(query);
        return Results.Ok(result);
    }
}
