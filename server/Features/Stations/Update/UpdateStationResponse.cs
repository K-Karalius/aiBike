using server.Models;

namespace server.Features.Stations.Update;

public record UpdateStationResponse(
    Guid Id,
    string Name,
    decimal Latitude,
    decimal Longitude,
    int Capacity,
    uint RowVersion
)
{
    public static UpdateStationResponse From(Station station)
    {
        return new UpdateStationResponse(station.Id, station.Name, station.Latitude, station.Longitude,
            station.Capacity, station.RowVersion);
    }
};