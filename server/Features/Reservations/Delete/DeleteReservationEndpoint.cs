using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Reservations.Delete;

public class DeleteReservationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapDelete("/api/reservation/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = dbContext.Reservations.FirstOrDefault(r => r.Id == id);
                if (result == null) return Results.NotFound("Reservation not found");
                dbContext.Remove(result);
                await dbContext.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}