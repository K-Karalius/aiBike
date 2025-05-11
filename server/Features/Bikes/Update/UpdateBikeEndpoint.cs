using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Bikes.Update;

public class UpdateBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/bike/",
            async (ApplicationDbContext dbContext, UpdateBikeRequest request) =>
            {
                var bike = dbContext.Bikes.Find(request.Id);
                if (bike == null) return Results.NotFound("Bike not found");
                bike.SerialNumber = request.SerialNumber;
                bike.BikeStatus = request.BikeStatus;
                bike.CurrentStationId = request.CurrentStationId;
                await dbContext.SaveChangesAsync();
                return Results.Ok(bike);
            });
}