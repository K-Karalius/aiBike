namespace server.Features.BusinessConstants.Get;

public record BusinessConstantsResponse
{
    public decimal FarePerMinute { get; init; }
    public decimal StationRadius { get; init; }
}