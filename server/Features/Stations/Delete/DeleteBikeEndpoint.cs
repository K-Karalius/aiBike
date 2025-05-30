using server.Common.Abstractions;
using server.Common.Authorization;
using server.DatabaseContext;

namespace server.Features.Stations.Delete;

public class DeleteStationEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapDelete("/api/station/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = dbContext.Stations.FirstOrDefault(b => b.Id == id);
                if (result == null) return Results.NotFound("Station not found");
                dbContext.Remove(result);
                await dbContext.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization(AuthorizationPolicies.AdminOnly);
}