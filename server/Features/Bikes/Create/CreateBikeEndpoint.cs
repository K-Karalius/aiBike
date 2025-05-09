using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Bikes.Create;

public class CreateBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/bike/",
            async (ApplicationDbContext dbContext, CreateBikeRequest request) =>
            {
                var bike = new Bike(){
                    SerialNumber = request.SerialNumber,
                    BikeStatus = request.BikeStatus,
                    CurrentStationId = request.CurrentStationId
                };
                await dbContext.AddAsync(bike);
                await dbContext.SaveChangesAsync();
                var result = dbContext.Bike.Find(bike.Id);
                return result != null
                    ? Results.Ok(result)
                    : Results.UnprocessableEntity("An error occured");
            });
}