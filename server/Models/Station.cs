using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Station
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public int Capacity { get; set; }

    public List<Bike> Bikes { get; set; } = [];

    [ConcurrencyCheck]
    [Column("xmin")]
    public uint RowVersion { get; set; }
}