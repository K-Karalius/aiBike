using server.Models;

namespace server.Features.Rides.Create;

public record CreateRideRequest
{
    public required string UserId { get; init;}
    public Guid? BikeId { get; init;}
    public Guid? StartStationId { get; init;}
    public Guid? EndStationId { get; init;}
}