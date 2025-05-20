using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Common.Abstractions;
using server.DatabaseContext;
using server.Extensions;

namespace server.Features.Reservations.GetAll;

public class GetAllReservationsEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder builder) =>
        builder.MapGet("/api/reservation/",
            async (ApplicationDbContext dbContext, CancellationToken cancellationToken, [FromQuery] int page = 1, [FromQuery] int pageSize = 50) =>
            {
                var result = await dbContext.Reservations.ToPagedResultAsync(page, pageSize, cancellationToken);
                return Results.Ok(result);
            });
}