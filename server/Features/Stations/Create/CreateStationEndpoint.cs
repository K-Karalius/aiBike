using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Stations.Create;

public class CreateStationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/station/",
            async (ApplicationDbContext dbContext, CreateStationRequest request) =>
            {
                var station = new Station(){
                    Name = request.Name,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    Capacity = request.Capacity,
                };
                await dbContext.AddAsync(station);
                await dbContext.SaveChangesAsync();
                return Results.Ok(station);
            });
}