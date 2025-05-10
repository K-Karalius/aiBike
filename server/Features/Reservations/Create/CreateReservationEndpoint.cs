using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Reservations.Create;

public class CreateReservationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapPost("/api/reservation/",
            async (ApplicationDbContext dbContext, CreateReservationRequest request) =>
            {
                var reservation = new Reservation(){
                    UserId = request.UserId,
                    BikeId = request.BikeId,
                    StationId = request.StationId,
                    ReservedAtUTC = request.ReservedAtUTC ?? DateTime.UtcNow,
                    ExpiresAtUTC = request.ExpiresAtUTC,
                    ReservationStatus = request.ReservationStatus,
                };
                await dbContext.AddAsync(reservation);
                await dbContext.SaveChangesAsync();
                return Results.Ok(reservation);
            });
}