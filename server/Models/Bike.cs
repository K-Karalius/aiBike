using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Bike
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set;}
    public string SerialNumber { get; set;}
    public BikeStatus BikeStatus { get; set;}
    public int CurrentStationId { get; set;}

    public Station? CurrentStation { get; set;}
}