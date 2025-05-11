using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Stations.GetAll;

public class GetAllStationsEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet(
                "/api/station",
                async (
                    ApplicationDbContext dbContext,
                    [FromQuery] decimal latitude,
                    [FromQuery] decimal longitude,
                    [FromQuery] decimal radiusKm,
                    [FromQuery] int page = 1,
                    [FromQuery] int pageSize = 50
                ) =>
                {
                    var allStations = await dbContext.Stations.ToListAsync();

                    var nearbyStations = allStations
                        .Where(station =>
                            CalculateDistanceInKilometers(
                                (double)latitude,
                                (double)longitude,
                                (double)station.Latitude,
                                (double)station.Longitude
                            ) <= (double)radiusKm
                        )
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize);

                    return Results.Ok(nearbyStations);
                })
            .RequireAuthorization(AuthorizationPolicies.UserOrAdmin);

    private static double CalculateDistanceInKilometers(
        double userLatitudeDegrees,
        double userLongitudeDegrees,
        double stationLatitudeDegrees,
        double stationLongitudeDegrees
    )
    {
        const double earthRadiusKm = 6371.0;
        const double toRadians = Math.PI / 180.0;

        var deltaLatitude = (stationLatitudeDegrees - userLatitudeDegrees) * toRadians;
        var deltaLongitude = (stationLongitudeDegrees - userLongitudeDegrees) * toRadians;

        var sinLat = Math.Sin(deltaLatitude / 2.0);
        var sinLon = Math.Sin(deltaLongitude / 2.0);

        var a = sinLat * sinLat
                + Math.Cos(userLatitudeDegrees * toRadians)
                * Math.Cos(stationLatitudeDegrees * toRadians)
                * sinLon * sinLon;

        var centralAngle = 2.0 * Math.Asin(Math.Min(1.0, Math.Sqrt(a)));
        return earthRadiusKm * centralAngle;
    }
}