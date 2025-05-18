using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Bikes.Delete;

public class DeleteBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapDelete("/api/bike/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = dbContext.Bikes.FirstOrDefault(b => b.Id == id);
                if (result == null) return Results.NotFound("Bike not found");
                dbContext.Remove(result);
                await dbContext.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}