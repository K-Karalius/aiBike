using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Stations.Get;

public class GetStationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/station/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = await dbContext.Stations.FirstOrDefaultAsync(b => b.Id == id);
                if (result == null) return Results.NotFound("Station not found");
                return Results.Ok(result);
            }).AllowAnonymous();
}