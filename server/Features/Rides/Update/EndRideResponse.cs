namespace server.Features.Rides.Update;

public record EndRideResponse
{
    public decimal TotalDurationMinutes { get; init; }
    public decimal Fare { get; init; }
}