using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Bikes.Delete;

public class DeleteBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapDelete("/api/bike/{id}",
            (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = dbContext.Bike.FirstOrDefault(b => b.Id == id);
                if (result == null) return Results.NotFound("Bike not found");
                dbContext.Remove(result);
                dbContext.SaveChanges();
                return Results.Ok();
            });
}