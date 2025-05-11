using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Reservations.Get;

public class GetReservationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/reservation/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = await dbContext.Reservations.FirstOrDefaultAsync(r => r.Id == id);
                if (result == null) return Results.NotFound("Reservation not found");
                return Results.Ok(result);
            }).AllowAnonymous();
}