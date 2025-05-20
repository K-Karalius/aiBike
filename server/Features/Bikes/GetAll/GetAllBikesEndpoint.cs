using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Extensions;

namespace server.Features.Bikes.GetAll;

public class GetAllBikesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/bike/",
            async (ApplicationDbContext dbContext, CancellationToken cancellationToken, [FromQuery] int page = 1, [FromQuery] int pageSize = 50) =>
            {
                var result = await dbContext.Bikes.ToPagedResultAsync(page, pageSize, cancellationToken);
                return Results.Ok(result);
            });
}