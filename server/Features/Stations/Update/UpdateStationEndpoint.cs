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
                var station = await dbContext.Stations.FirstOrDefaultAsync(s => s.Id == request.Id);
                if (station == null) return Results.NotFound("Station not found");

                dbContext.Entry(station)
                    .Property(s => s.RowVersion)
                    .OriginalValue = request.RowVersion;

                if (request.Capacity != null)
                {
                    var currentBikeCount = await dbContext.Bikes
                        .CountAsync(b => b.CurrentStationId == request.Id);

                    if (request.Capacity < currentBikeCount)
                        return Results.UnprocessableEntity(
                            "Station capacity cannot be lower than it's current bike count");
                    station.Capacity = (int)request.Capacity;
                }

                if (request.Name != null) station.Name = request.Name;
                if (request.Latitude != null) station.Latitude = (decimal)request.Latitude;
                if (request.Longitude != null) station.Longitude = (decimal)request.Longitude;
                try
                {
                    await dbContext.SaveChangesAsync();
                    return Results.Ok(UpdateStationResponse.From(station));
                }
                catch (DbUpdateConcurrencyException)
                {
                    var currentState = await dbContext.Stations
                        .AsNoTracking()
                        .FirstAsync(s => s.Id == request.Id);

                    var attemptedChanges = new Dictionary<string, object?>();
                    if (request.Name is not null) attemptedChanges[nameof(request.Name).ToLowerInvariant()] = request.Name;
                    if (request.Latitude is not null) attemptedChanges[nameof(request.Latitude).ToLowerInvariant()] = request.Latitude.Value;
                    if (request.Longitude is not null) attemptedChanges[nameof(request.Longitude).ToLowerInvariant()] = request.Longitude.Value;
                    if (request.Capacity is not null) attemptedChanges[nameof(request.Capacity).ToLowerInvariant()] = request.Capacity.Value;

                    return Results.Conflict(new
                    {
                        message = "Update conflict detected",
                        currentData = UpdateStationResponse.From(currentState),
                        yourChanges = attemptedChanges
                    });
                }
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}