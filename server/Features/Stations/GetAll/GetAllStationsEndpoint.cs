namespace server.Features.Stations.GetAll;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Common.Authorization;
using DatabaseContext;

public static class GetAllStationsEndpoint
{
    private const double EarthRadiusKm = 6371.0;
    private const double ToRadians = Math.PI / 180.0;

    public static RouteHandlerBuilder MapGetAllStations(this IEndpointRouteBuilder app)
        => app.MapGet("/api/station", HandleGetAllStations)
              .RequireAuthorization(AuthorizationPolicies.UserOrAdmin);

    private static async Task<IResult> HandleGetAllStations(
        ApplicationDbContext dbContext,
        [FromQuery] decimal latitude,
        [FromQuery] decimal longitude,
        [FromQuery] decimal radiusKm,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var latDegrees = (double)latitude;
        var lonDegrees = (double)longitude;
        var radius = (double)radiusKm;

        var latDelta = (radius / EarthRadiusKm) * (180.0 / Math.PI);
        var lonDelta = (radius / EarthRadiusKm)
                       * (180.0 / Math.PI)
                       / Math.Cos(latDegrees * ToRadians);

        var minLat = latDegrees - latDelta;
        var maxLat = latDegrees + latDelta;
        var minLon = lonDegrees - lonDelta;
        var maxLon = lonDegrees + lonDelta;

        var candidates = await dbContext.Stations
            .AsNoTracking()
            .Where(s =>
                s.Latitude  >= (decimal)minLat &&
                s.Latitude  <= (decimal)maxLat &&
                s.Longitude >= (decimal)minLon &&
                s.Longitude <= (decimal)maxLon)
            .Include(s => s.Bikes)
            .ToListAsync();

        var nearbyPaged = candidates
            .Where(s =>
                CalculateDistanceInKilometers(
                    latDegrees,
                    lonDegrees,
                    (double)s.Latitude,
                    (double)s.Longitude) <= radius)
            .OrderBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new GetAllStationsResponse
          {
              Id        = s.Id,
              Name      = s.Name,
              Latitude  = s.Latitude,
              Longitude = s.Longitude,
              Capacity  = s.Capacity,
              BikeCount = s.Bikes.Count
          })
            .ToList();

        return Results.Ok(nearbyPaged);
    }

    private static double CalculateDistanceInKilometers(
        double userLatDeg,
        double userLonDeg,
        double stationLatDeg,
        double stationLonDeg)
    {
        var userLatRad    = userLatDeg    * ToRadians;
        var userLonRad    = userLonDeg    * ToRadians;
        var stationLatRad = stationLatDeg * ToRadians;
        var stationLonRad = stationLonDeg * ToRadians;

        var dLat = stationLatRad - userLatRad;
        var dLon = stationLonRad - userLonRad;
        var sinLat2 = Math.Sin(dLat / 2.0);
        var sinLon2 = Math.Sin(dLon / 2.0);

        var a = sinLat2 * sinLat2
              + Math.Cos(userLatRad)
              * Math.Cos(stationLatRad)
              * sinLon2 * sinLon2;

        var c = 2.0 * Math.Asin(Math.Min(1.0, Math.Sqrt(a)));
        return EarthRadiusKm * c;
    }
}
