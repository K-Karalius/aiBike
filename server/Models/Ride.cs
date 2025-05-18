using Microsoft.AspNetCore.Identity;

namespace server.Models;

public class Ride
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; }
    public Guid? BikeId { get; set; }
    public Guid? StartStationId { get; set; }
    public Guid? EndStationId { get; set; }
    public DateTime? StartedAtUTC { get; set; }
    public DateTime? FinishedAtUTC { get; set; }
    public decimal DistanceMeters { get; set; }
    public decimal FareAmount { get; set; }
    public RideStatus RideStatus { get; set; }

    public IdentityUser? User { get; set; }
    public Bike? Bike { get; set; }
    public Station? StartStation { get; set; }
    public Station? EndStation { get; set; }
}