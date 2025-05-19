using server.Models;

namespace server.Features.Bikes.Update;

public record UpdateBikeRequest
{
    public required Guid Id { get; init; }
    public string? SerialNumber { get; init; }
    public BikeStatus? BikeStatus { get; init; }
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
    public Guid? CurrentStationId { get; init; }
}