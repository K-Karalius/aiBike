using server.Models;

namespace server.Features.Rides.Update;

public record UpdateRideRequest
{
    public Guid Id { get; init;}
    public required string UserId { get; init;}
    public Guid? BikeId { get; init;}
    public Guid? StartStationId { get; init;}
    public Guid? EndStationId { get; init;}
    public DateTime? StartedAtUTC { get; init;}
    public DateTime? FinishedAtUTC { get; init;}
    public decimal DistanceMeters { get; init;}
    public decimal FareAmount { get; init;}
    public RideStatus RideStatus { get; init;}
}