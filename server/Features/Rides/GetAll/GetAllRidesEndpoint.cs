using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Extensions;

namespace server.Features.Rides.GetAll;

public class GetAllRidesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/",
            async (HttpContext httpContext, ApplicationDbContext dbContext, CancellationToken cancellationToken, [FromQuery] int page = 1, [FromQuery] int pageSize = 50) =>
            {
                var userId = httpContext.GetCurrentUserId();
                if (userId == null) return Results.Unauthorized();

                if (httpContext.IsCurrentUserAdmin())
                {
                    var allRides = await dbContext.Rides
                        .OrderByDescending(r => r.StartedAtUTC)
                        .ToPagedResultAsync(page, pageSize, cancellationToken);

                    return Results.Ok(allRides);
                }

                var userRides = await dbContext.Rides
                    .Where(r => r.UserId == userId)
                    .OrderByDescending(r => r.StartedAtUTC)
                    .ToPagedResultAsync(page, pageSize, cancellationToken);

                return Results.Ok(userRides);
            });
}