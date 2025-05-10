using server.Models;

namespace server.Features.Stations.Create;

public record CreateStationRequest
{
    public required string Name { get; set;}
    public decimal Latitude { get; set;}
    public decimal Longitude { get; set;}
    public int Capacity { get; set;}
}