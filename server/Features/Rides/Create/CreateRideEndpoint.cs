using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;
using server.Extensions;

namespace server.Features.Rides.Create;

public class CreateRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/ride/start",
            async (HttpContext httpContext, ApplicationDbContext dbContext, CreateRideRequest request) =>
            {
                var userId = httpContext.GetCurrentUserId();
                if (userId == null)
                    return Results.Unauthorized();

                var bike = await dbContext.Bikes.FirstOrDefaultAsync(b => b.Id == request.BikeId);
                if (bike == null)
                    return Results.NotFound("Bike not found");
                if (bike.BikeStatus != BikeStatus.Available)
                    return Results.UnprocessableEntity("The bike is not available");
                if (bike.CurrentStationId != request.StartStationId)
                    return Results.UnprocessableEntity("The bike is not in the right station");

                var user = await dbContext.Users.FirstOrDefaultAsync(b => b.Id == userId);
                if (user == null)
                    return Results.NotFound("User not found");

                var currentRide = await dbContext.Rides.FirstOrDefaultAsync(r => r.RideStatus == RideStatus.Ongoing && r.UserId == userId);
                if (currentRide != null)
                    return Results.UnprocessableEntity("The user already has an ongoing ride.");

                var ride = new Ride()
                {
                    UserId = userId,
                    BikeId = request.BikeId,
                    StartStationId = request.StartStationId,
                    RideStatus = RideStatus.Ongoing,
                    StartedAtUTC = DateTime.UtcNow,
                    FareAmount = 0,
                    DistanceMeters = 0
                };

                await dbContext.AddAsync(ride);
                bike.CurrentStationId = null;
                bike.BikeStatus = BikeStatus.Occupied;
                await dbContext.SaveChangesAsync();
                return Results.Ok(ride);
            });
}