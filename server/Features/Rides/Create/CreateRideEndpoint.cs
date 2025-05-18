using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Rides.Create;

public class CreateRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/ride/",
            async (ApplicationDbContext dbContext, CreateRideRequest request) =>
            {
                var Ride = new Ride()
                {
                    UserId = request.UserId,
                    BikeId = request.BikeId,
                    StartStationId = request.StartStationId,
                    RideStatus = request.RideStatus,
                    StartedAtUTC = DateTime.UtcNow,
                    FareAmount = 0,
                    DistanceMeters = 0
                };
                await dbContext.AddAsync(Ride);
                await dbContext.SaveChangesAsync();
                return Results.Ok(Ride);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}