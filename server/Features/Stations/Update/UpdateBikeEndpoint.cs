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
                station.Name = request.Name;
                station.Latitude = request.Latitude;
                station.Longitude = request.Longitude;
                await dbContext.SaveChangesAsync();
                return Results.Ok(station);
            });
}