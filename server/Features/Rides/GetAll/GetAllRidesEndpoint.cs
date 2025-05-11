using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Rides.GetAll;

public class GetAllRidesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/ride/",
            async (ApplicationDbContext dbContext, [FromQuery] int page = 1, [FromQuery] int pageSize = 50) =>
            {
                var result = await dbContext.Rides.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Results.Ok(result);
            }).AllowAnonymous();
}