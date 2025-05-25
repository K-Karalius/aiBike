using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Stations.Update;

public class UpdateStationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/station/",
            async (ApplicationDbContext dbContext, UpdateStationRequest request) =>
            {
                var station = dbContext.Stations.Include(s => s.Bikes).FirstOrDefault(s => s.Id == request.Id);
                if (station == null) return Results.NotFound("Station not found");
                if (request.Capacity != null)
                {
                    if (request.Capacity < station.Bikes.Count)
                        return Results.UnprocessableEntity(
                            "Station capacity cannot be lower than it's current bike count");
                    station.Capacity = (int)request.Capacity;
                }

                if (request.Name != null) station.Name = request.Name;
                if (request.Latitude != null) station.Latitude = (decimal)request.Latitude;
                if (request.Longitude != null) station.Longitude = (decimal)request.Longitude;
                try
                {
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    await dbContext.SaveChangesAsync();
                    return Results.Ok(station);
                }
                catch (DbUpdateConcurrencyException)
                {
                    var currentState = await dbContext.Stations
                        .Include(s => s.Bikes)
                        .FirstAsync(s => s.Id == request.Id);

                    var attemptedChanges = new Dictionary<string, object?>();
                    if (request.Name is not null) attemptedChanges[nameof(request.Name).ToLowerInvariant()] = request.Name;
                    if (request.Latitude is not null) attemptedChanges[nameof(request.Latitude).ToLowerInvariant()] = request.Latitude.Value;
                    if (request.Longitude is not null) attemptedChanges[nameof(request.Longitude).ToLowerInvariant()] = request.Longitude.Value;
                    if (request.Capacity is not null) attemptedChanges[nameof(request.Capacity).ToLowerInvariant()] = request.Capacity.Value;

                    return Results.Conflict(new
                    {
                        message = "Update conflict detected",
                        currentData = currentState,
                        yourChanges = attemptedChanges
                    });
                }
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}