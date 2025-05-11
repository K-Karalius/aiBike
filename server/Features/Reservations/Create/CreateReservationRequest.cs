using server.Models;

namespace server.Features.Reservations.Create;

public record CreateReservationRequest
{
    public required string UserId { get; set; }
    public Guid? BikeId { get; set; }
    public Guid? StationId { get; set; }
    public DateTime? ReservedAtUTC { get; set; }
    public DateTime ExpiresAtUTC { get; set; }
    public ReservationStatus ReservationStatus { get; set; }
}