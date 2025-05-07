using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Station
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set;}
    public string Name { get; set;}
    public decimal Latitude { get; set;}
    public decimal Longitude { get; set;}
    public int Capacity { get; set;}
    public ICollection<Bike> Bikes { get; set;}
}