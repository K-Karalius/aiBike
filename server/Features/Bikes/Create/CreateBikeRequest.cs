using server.Models;

namespace server.Features.Bikes.Create;

public record CreateBikeRequest
{
    public required string SerialNumber { get; init; }
    public required BikeStatus BikeStatus { get; init; }
    public Guid? CurrentStationId { get; init; }
}