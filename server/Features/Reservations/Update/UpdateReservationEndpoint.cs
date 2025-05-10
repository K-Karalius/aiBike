using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Reservations.Update;

public class UpdateReservationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/reservation/",
            async (ApplicationDbContext dbContext, UpdateReservationRequest request) =>
            {
                var reservation = dbContext.Reservation.Find(request.Id);
                if (reservation == null) return Results.NotFound("Reservation not found");
                reservation.UserId = request.UserId;
                reservation.BikeId = request.BikeId;
                reservation.StationId = request.StationId;
                reservation.ReservedAtUTC = request.ReservedAtUTC;
                reservation.ExpiresAtUTC = request.ExpiresAtUTC;
                reservation.ReservationStatus = request.ReservationStatus;
                await dbContext.SaveChangesAsync();
                return Results.Ok(reservation);
            });
}