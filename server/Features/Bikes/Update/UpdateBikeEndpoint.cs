using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Bikes.Update;

public class UpdateBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/bike/",
            async (ApplicationDbContext dbContext, UpdateBikeRequest request) =>
            {
                var bike = dbContext.Bike.Find(request.Id);
                if (bike == null) return Results.NotFound("Bike not found");
                bike.Id = request.Id;
                bike.SerialNumber = request.SerialNumber;
                bike.BikeStatus = request.BikeStatus;
                bike.CurrentStationId = request.CurrentStationId;
                dbContext.Bike.Update(bike);
                await dbContext.SaveChangesAsync();
                var result = dbContext.Bike.Find(bike.Id);
                return result != null
                    ? Results.Ok(result)
                    : Results.UnprocessableEntity("An error occured");
            });
}