using server.Models;

namespace server.Features.Bikes.Update;

public record UpdateBikeRequest
{
    public required Guid Id { get; init; }
    public required string SerialNumber { get; init; }
    public required BikeStatus BikeStatus { get; init; }
    public Guid? CurrentStationId { get; init; }
}