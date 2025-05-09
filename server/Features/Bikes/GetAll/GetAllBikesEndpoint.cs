using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Bikes.GetAll;

public class GetAllBikesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/bike/",
            async (ApplicationDbContext dbContext, [FromQuery] int page = 0, [FromQuery] int pageSize = 50) =>
            {
                var result = await dbContext.Bike.Skip(page * pageSize).Take(pageSize).ToListAsync();
                return Results.Ok(result);
            }).AllowAnonymous();
}