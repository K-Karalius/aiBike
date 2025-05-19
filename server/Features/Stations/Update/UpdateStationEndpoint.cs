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
                if(station == null) return Results.NotFound("Station not found");
                if (request.Capacity != null)
                {
                    if(request.Capacity < station.Bikes.Count) return Results.UnprocessableEntity("Station capacity cannot be lower than it's current bike count");
                    station.Capacity = (int) request.Capacity;
                }
                if (request.Name != null) station.Name = request.Name;
                if(request.Latitude != null) station.Latitude = (decimal) request.Latitude;
                if(request.Longitude != null) station.Longitude = (decimal) request.Longitude;                
                await dbContext.SaveChangesAsync();
                return Results.Ok(station);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}