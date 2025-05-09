using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace server.Models;

public class Reservation
{
    public Guid Id { get; set;} = Guid.NewGuid();
    public string UserId { get; set;}
    public Guid? BikeId { get; set;}
    public Guid? StationId { get; set;}
    public DateTime ReservedAtUTC { get; set;}
    public DateTime ExpiresAtUTC { get; set;}
    public ReservationStatus ReservationStatus { get; set;}

    public IdentityUser? User { get; set;}
    public Bike? Bike { get; set;}
    public Station? Station { get; set;}
}