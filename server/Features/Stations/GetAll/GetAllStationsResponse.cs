namespace server.Features.Stations.GetAll;

public record GetAllStationsResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int Capacity { get; set; }
    public int BikeCount { get; set; }
    public uint RowVersion { get; set; }
};