using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Extensions;
using server.Models;

namespace server.Features.Rides.Get;

public class GetCurrentUserRideEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/current",
            async (HttpContext httpContext, ApplicationDbContext dbContext) =>
            {
                var userId = httpContext.GetCurrentUserId();
                if (userId == null)
                    return Results.Unauthorized();

                var result = await dbContext.Rides.FirstOrDefaultAsync(r => r.RideStatus == RideStatus.Ongoing && r.UserId == userId);
                return Results.Ok(result);
            });
}