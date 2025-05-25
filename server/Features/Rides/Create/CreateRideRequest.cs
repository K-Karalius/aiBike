namespace server.Features.Rides.Create;

public record CreateRideRequest
{
    public Guid BikeId { get; init; }
    public Guid StartStationId { get; init; }
}