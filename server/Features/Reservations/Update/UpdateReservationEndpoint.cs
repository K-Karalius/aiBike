using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Reservations.Update;

public class UpdateReservationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPatch("/api/reservation/",
            async (ApplicationDbContext dbContext, UpdateReservationRequest request) =>
            {
                var reservation = dbContext.Reservations.Find(request.Id);
                if (reservation == null) return Results.NotFound("Reservation not found");
                if (request.BikeId != null) reservation.BikeId = request.BikeId;
                if (request.StationId != null) reservation.StationId = request.StationId;
                if (request.ReservedAtUTC != null) reservation.ReservedAtUTC = (DateTime)request.ReservedAtUTC;
                if (request.ExpiresAtUTC != null) reservation.ExpiresAtUTC = (DateTime)request.ExpiresAtUTC;
                if (request.ReservationStatus != null) reservation.ReservationStatus = (Models.ReservationStatus)request.ReservationStatus;
                await dbContext.SaveChangesAsync();
                return Results.Ok(reservation);
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}