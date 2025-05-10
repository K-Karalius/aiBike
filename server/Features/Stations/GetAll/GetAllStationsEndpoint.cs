using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;

namespace server.Features.Stations.GetAll;

public class GetAllStationsEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/station/",
            async (ApplicationDbContext dbContext, [FromQuery] int page = 1, [FromQuery] int pageSize = 50) =>
            {
                var result = await dbContext.Station.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
                return Results.Ok(result);
            }).AllowAnonymous();
}