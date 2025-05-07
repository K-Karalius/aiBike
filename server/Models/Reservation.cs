using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace server.Models;

public class Reservation
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set;}
    public string UserId { get; set;}
    public int BikeId { get; set;}
    public int StationId { get; set;}
    public DateTime ReservedAtUTC { get; set;}
    public DateTime ExpiresAtUTC { get; set;}
    public ReservationStatus ReservationStatus { get; set;}

    public IdentityUser User { get; set;}
    public Bike Bike { get; set;}
    public Station Station { get; set;}
}