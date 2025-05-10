using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Rides.Get;

public class GetRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = await dbContext.Ride.FirstOrDefaultAsync(r => r.Id == id);
                if (result == null) return Results.NotFound("Ride not found");
                return Results.Ok(result);
            }).AllowAnonymous();
}