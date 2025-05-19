using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Rides.Get;

public class GetRideByBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/bike/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var bike = await dbContext.Bikes.FirstOrDefaultAsync(x => x.Id == id);
                if (bike == null) return Results.UnprocessableEntity("Bike not found");
                var result = await dbContext.Rides.FirstOrDefaultAsync(r => r.RideStatus == RideStatus.Ongoing && r.BikeId == bike.Id);
                return Results.Ok(result);
            });
}