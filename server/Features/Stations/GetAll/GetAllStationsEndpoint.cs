using server.Common.Authorization;
using server.Extensions;

namespace server.Features.Stations.GetAll;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Common.Abstractions;
using DatabaseContext;

public class GetAllStationsEndpoint : IEndpoint
{
    private const double EarthRadiusKm = 6371.0;
    private const double ToRadians     = Math.PI / 180.0;

    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/station", HandleGetAllStations)
               .RequireAuthorization(AuthorizationPolicies.UserOrAdmin);

    private static async Task<IResult> HandleGetAllStations(
        ApplicationDbContext dbContext,
        [FromQuery] decimal latitude,
        [FromQuery] decimal longitude,
        [FromQuery] decimal radiusKm,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var userLat  = (double)latitude;
        var userLon  = (double)longitude;
        var radius   = (double)radiusKm;

        // First cull by a cheap lat/lon bounding box
        var latDelta = (radius / EarthRadiusKm) * (180.0 / Math.PI);
        var lonDelta = latDelta / Math.Cos(userLat * ToRadians);

        var minLat = (decimal)(userLat - latDelta);
        var maxLat = (decimal)(userLat + latDelta);
        var minLon = (decimal)(userLon - lonDelta);
        var maxLon = (decimal)(userLon + lonDelta);

        var stationsQuery = dbContext.Stations
            .AsNoTracking()
            .Where(s =>
                s.Latitude  >= minLat &&
                s.Latitude  <= maxLat &&
                s.Longitude >= minLon &&
                s.Longitude <= maxLon)
            .Select(s => new
            {
                Station   = s,
                Distance  = EarthRadiusKm
                    * 2.0
                    * Math.Asin(
                        Math.Min(1.0, Math.Sqrt(
                            Math.Pow(Math.Sin(((double)s.Latitude - userLat) * ToRadians / 2.0), 2.0)
                          + Math.Cos(userLat * ToRadians)
                          * Math.Cos((double)s.Latitude * ToRadians)
                          * Math.Pow(Math.Sin(((double)s.Longitude - userLon) * ToRadians / 2.0), 2.0)
                        ))
                    ),
                BikeCount = s.Bikes.Count
            })
            .Where(x => x.Distance <= radius)
            .OrderBy(x => x.Station.Name)
            .Select(x => new GetAllStationsResponse
            {
                Id        = x.Station.Id,
                Name      = x.Station.Name,
                Latitude  = x.Station.Latitude,
                Longitude = x.Station.Longitude,
                Capacity  = x.Station.Capacity,
                BikeCount = x.BikeCount
            });

        var pagedResult =
            await stationsQuery.ToPagedResultAsync(page, pageSize, cancellationToken);

        return Results.Ok(pagedResult);
    }
}
