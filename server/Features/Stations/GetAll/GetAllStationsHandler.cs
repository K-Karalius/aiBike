using server.Common;
using server.Extensions;

namespace server.Features.Stations.GetAll;

using Common.Abstractions;
using DatabaseContext;
using Microsoft.EntityFrameworkCore;

public sealed class GetAllStationsHandler(ApplicationDbContext dbContext)
    : ICommandHandler<GetAllStationsQuery, PagedResult<GetAllStationsResponse>>
{
    public async Task<Result<PagedResult<GetAllStationsResponse>>> Handle(GetAllStationsQuery query)
    {
        var userLat = (double)query.Latitude;
        var userLon = (double)query.Longitude;
        var radius = (double)query.RadiusKm;
        const double earthRadiusKm = 6371.0;
        const double toRadians = Math.PI / 180.0;

        var latDelta = (radius / earthRadiusKm) * (180.0 / Math.PI);
        var lonDelta = latDelta / Math.Cos(userLat * toRadians);

        var minLat = (decimal)(userLat - latDelta);
        var maxLat = (decimal)(userLat + latDelta);
        var minLon = (decimal)(userLon - lonDelta);
        var maxLon = (decimal)(userLon + lonDelta);

        var queryable = dbContext.Stations
            .AsNoTracking()
            .Where(s =>
                s.Latitude >= minLat &&
                s.Latitude <= maxLat &&
                s.Longitude >= minLon &&
                s.Longitude <= maxLon)
            .Select(s => new
            {
                Station = s,
                Distance = earthRadiusKm
                           * 2.0
                           * Math.Asin(
                               Math.Min(1.0, Math.Sqrt(
                                   Math.Pow(Math.Sin(((double)s.Latitude - userLat) * toRadians / 2.0), 2.0)
                                   + Math.Cos(userLat * toRadians)
                                   * Math.Cos((double)s.Latitude * toRadians)
                                   * Math.Pow(Math.Sin(((double)s.Longitude - userLon) * toRadians / 2.0), 2.0)
                               ))
                           ),
                BikeCount = s.Bikes.Count
            })
            .Where(x => x.Distance <= radius)
            .OrderBy(x => x.Station.Name)
            .Select(x => new GetAllStationsResponse
            {
                Id = x.Station.Id,
                Name = x.Station.Name,
                Latitude = x.Station.Latitude,
                Longitude = x.Station.Longitude,
                Capacity = x.Station.Capacity,
                BikeCount = x.BikeCount,
                RowVersion = x.Station.RowVersion,
            });

        var paged = await queryable.ToPagedResultAsync(query.Page, query.PageSize);
        return Result<PagedResult<GetAllStationsResponse>>.Success(paged);
    }
}

public sealed record GetAllStationsQuery(
    decimal Latitude,
    decimal Longitude,
    decimal RadiusKm,
    int Page = 1,
    int PageSize = 50
);