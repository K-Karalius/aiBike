using server.Models;

namespace server.Features.Rides.Update;

public record EndRideRequest
{
    public Guid Id { get; init;}
    public required string UserId { get; init;}
}