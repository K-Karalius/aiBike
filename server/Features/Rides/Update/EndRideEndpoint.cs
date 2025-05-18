using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Bikes.Update;

public class StartRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/ride/end",
            async (ApplicationDbContext dbContext, UpdateBikeRequest request) =>
            {
                var ride = dbContext.Rides.Find(request.Id);
                if(ride == null) return Results.NotFound("Ride not found");
                if(ride.RideStatus != RideStatus.Ongoing) return Results.BadRequest("The ride has already ended.");
                ride.RideStatus = RideStatus.Finished;
                await dbContext.SaveChangesAsync();
                return Results.Ok(ride);
            });
}