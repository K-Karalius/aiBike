using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Bikes.Get;

public class GetBikeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/bike/{id}",
            async (ApplicationDbContext dbContext, Guid id) =>
            {
                var result = await dbContext.Bike.FirstOrDefaultAsync(b => b.Id == id);
                if (result == null) return Results.NotFound("Bike not found");
                return Results.Ok(result);
            }).AllowAnonymous();
}