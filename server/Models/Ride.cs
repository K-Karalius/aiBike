using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace server.Models;

public class Ride
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set;}
    public string UserId { get; set;}
    public int BikeId { get; set;}
    public int StartStationId { get; set;}
    public int EndStationId { get; set;}
    public DateTime? StartedAtUTC { get; set;}
    public DateTime? FinishedAtUTC { get; set;}
    public decimal DistanceMeters { get; set;}
    public decimal FareAmount { get; set;}
    public RideStatus RideStatus { get; set;}

    public IdentityUser User { get; set;}
    public Bike Bike { get; set;}
    public Station? StartStation { get; set;}
    public Station? EndStation { get; set;}
}