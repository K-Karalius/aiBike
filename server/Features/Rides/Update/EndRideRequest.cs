namespace server.Features.Rides.Update;

public record EndRideRequest
{
    public Guid Id { get; init; }
}