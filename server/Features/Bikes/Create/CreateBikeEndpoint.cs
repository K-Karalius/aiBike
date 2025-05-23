using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Bikes.Create;

public class CreateBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/bike/",
            async (ApplicationDbContext dbContext, CreateBikeRequest request) =>
            {
                var bike = new Bike()
                {
                    SerialNumber = request.SerialNumber,
                    BikeStatus = request.BikeStatus,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    CurrentStationId = request.CurrentStationId
                };
                await dbContext.AddAsync(bike);
                await dbContext.SaveChangesAsync();
                return Results.Ok(bike);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}