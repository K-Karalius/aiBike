using Geolocation;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Features.BusinessConstants.Get;
using server.Models;
using server.Extensions;

namespace server.Features.Rides.Update;

public class StartRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/ride/end",
            async (HttpContext httpContext, ApplicationDbContext dbContext, EndRideRequest request) =>
            {
                var userId = httpContext.GetCurrentUserId();
                if (userId == null) return Results.Unauthorized();

                var ride = dbContext.Rides.Find(request.Id);
                if (ride == null) return Results.NotFound("Ride not found");

                if (ride.UserId != userId && !httpContext.IsCurrentUserAdmin())
                    return Results.Forbid();

                if (ride.RideStatus != RideStatus.Ongoing)
                    return Results.BadRequest("The ride has already ended");

                if (ride.StartedAtUTC == null)
                    return Results.UnprocessableEntity("Ride does not have a start date");

                var bike = dbContext.Bikes.FirstOrDefault(b => b.Id == ride.BikeId);

                if (bike == null)
                    return Results.UnprocessableEntity("Invalid bike");

                var station = dbContext.Stations.Include(s => s.Bikes).AsEnumerable().FirstOrDefault(s => (decimal)GeoCalculator.GetDistance((double)s.Latitude, (double)s.Longitude, (double)bike.Latitude, (double)bike.Longitude, 2, DistanceUnit.Meters) <= GetBusinessConstants.stationRadius);
                if (station == null)
                    return Results.UnprocessableEntity("The bike is not in a station");
                if(station.Bikes.Count >= station.Capacity) 
                    return Results.UnprocessableEntity("The station is full");
                bike.CurrentStationId = station.Id;
                bike.BikeStatus = BikeStatus.Available;
                ride.RideStatus = RideStatus.Finished;
                ride.FinishedAtUTC = DateTime.UtcNow;
                ride.EndStationId = station.Id;
                TimeSpan time = (TimeSpan) (ride.FinishedAtUTC - ride.StartedAtUTC);
                ride.FareAmount = (decimal) time.TotalMinutes * GetBusinessConstants.farePerMinute;
                await dbContext.SaveChangesAsync();
                return Results.Ok(new EndRideResponse(){TotalDurationMinutes = (decimal) time.TotalMinutes, Fare = ride.FareAmount});
            });
}