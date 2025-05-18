using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Stations.Update;

public class UpdateStationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/station/",
            async (ApplicationDbContext dbContext, UpdateStationRequest request) =>
            {
                var station = dbContext.Station.Find(request.Id);
                if (station == null) return Results.NotFound("Station not found");
                if (request.Name != null) station.Name = request.Name;
                if (request.Latitude != null) station.Latitude = (decimal) request.Latitude;
                if (request.Longitude != null) station.Longitude = (decimal) request.Longitude;
                if (request.Capacity != null) station.Capacity = (int) request.Capacity;
                await dbContext.SaveChangesAsync();
                return Results.Ok(station);
            });
}