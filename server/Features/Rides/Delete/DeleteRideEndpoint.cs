using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Rides.Delete;

public class DeleteRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapDelete("/api/ride/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = dbContext.Rides.FirstOrDefault(r => r.Id == id);
                if (result == null) return Results.NotFound("Ride not found");
                dbContext.Remove(result);
                await dbContext.SaveChangesAsync();
                return Results.Ok();
            });
}