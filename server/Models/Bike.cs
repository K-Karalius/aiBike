using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

public class Bike
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SerialNumber { get; set; }
    public BikeStatus BikeStatus { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public Guid? CurrentStationId { get; set; }

    [JsonIgnore]
    public Station? CurrentStation { get; set; }
}