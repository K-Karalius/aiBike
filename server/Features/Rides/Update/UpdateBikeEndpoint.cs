using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Rides.Update;

public class UpdateRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/ride/",
            async (ApplicationDbContext dbContext, UpdateRideRequest request) =>
            {
                var Ride = dbContext.Ride.Find(request.Id);
                if (Ride == null) return Results.NotFound("Ride not found");
                Ride.UserId = request.UserId;
                Ride.BikeId = request.BikeId;
                Ride.StartStationId = request.StartStationId;
                Ride.EndStationId = request.EndStationId;
                Ride.StartedAtUTC = request.StartedAtUTC;
                Ride.FinishedAtUTC = request.FinishedAtUTC;
                Ride.DistanceMeters = request.DistanceMeters;
                Ride.FareAmount = request.FareAmount;
                Ride.RideStatus = request.RideStatus;
                await dbContext.SaveChangesAsync();
                return Results.Ok(Ride);
            });
}