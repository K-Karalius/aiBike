using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Rides.Get;

public class GetRideByUserEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/user/{id}",
            async (ApplicationDbContext dbContext, string id) =>
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (user == null) return Results.UnprocessableEntity("User not found");
                var result = await dbContext.Rides.FirstOrDefaultAsync(r => r.RideStatus == RideStatus.Ongoing && r.UserId == user.Id);
                return Results.Ok(result);
            });
}