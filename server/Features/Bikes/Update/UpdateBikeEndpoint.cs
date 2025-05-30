using Geolocation;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Bikes.Update;

public class UpdateBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/bike/",
            async (ApplicationDbContext dbContext, UpdateBikeRequest request) =>
            {
                var bike = dbContext.Bikes.Find(request.Id);
                if (bike == null) return Results.NotFound("Bike not found");
                if (request.SerialNumber != null) bike.SerialNumber = request.SerialNumber;
                if (request.BikeStatus != null) bike.BikeStatus = (BikeStatus)request.BikeStatus;
                if (request.CurrentStationId != null)
                {
                    var station = await dbContext.Stations.Include(s => s.Bikes).FirstOrDefaultAsync(s => s.Id == request.CurrentStationId);
                    if (station == null) return Results.NotFound("Station not found");
                    if (station.Bikes.Count >= station.Capacity) return Results.UnprocessableEntity("The station is full");
                    bike.CurrentStationId = request.CurrentStationId;
                    bike.Latitude = station.Latitude;
                    bike.Longitude = station.Longitude;
                }
                else if (request.Latitude != null && request.Longitude != null)
                {
                    var ride = dbContext.Rides.FirstOrDefault(r => r.RideStatus == RideStatus.Ongoing && r.BikeId == bike.Id);
                    if (ride != null)
                    {
                        var oldCoordinates = new Coordinate() { Latitude = (double)bike.Latitude, Longitude = (double)bike.Longitude };
                        var newCoordinates = new Coordinate() { Latitude = (double)request.Latitude, Longitude = (double)request.Longitude };
                        ride.DistanceMeters += (decimal)GeoCalculator.GetDistance(oldCoordinates, newCoordinates, 2, DistanceUnit.Meters);
                    }
                    bike.Latitude = (decimal)request.Latitude;
                    bike.Longitude = (decimal)request.Longitude;
                }
                await dbContext.SaveChangesAsync();
                return Results.Ok(bike);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}