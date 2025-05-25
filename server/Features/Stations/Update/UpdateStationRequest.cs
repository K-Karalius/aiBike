namespace server.Features.Stations.Update;

public record UpdateStationRequest
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
    public int? Capacity { get; init; }
}