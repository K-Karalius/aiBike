using server.Common.Abstractions;
using server.Common.Authorization;
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
                if(request.SerialNumber != null) bike.SerialNumber = request.SerialNumber;
                if(request.BikeStatus != null) bike.BikeStatus = (Models.BikeStatus) request.BikeStatus;
                if(request.CurrentStationId != null) bike.CurrentStationId = request.CurrentStationId;
                if(request.Latitude != null) bike.Latitude = (decimal) request.Latitude;
                if(request.Longitude != null) bike.Longitude = (decimal) request.Longitude;
                await dbContext.SaveChangesAsync();
                return Results.Ok(bike);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}