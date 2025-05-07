using server.DatabaseContext;
using server.Models;

namespace server.Features.Repositories;

public class StationRepository
{
    private readonly ApplicationDbContext _dbContext;

    public StationRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ICollection<Station> GetAllStations()
    {
        return [.. _dbContext.Station];
    }

    public Station? GetStation(int id)
    {
        return _dbContext.Station.FirstOrDefault(s => s.Id == id);
    }

    public Station? CreateStation(Station station)
    {
        _dbContext.Add(station);
        _dbContext.SaveChanges();
        return _dbContext.Station.Find(station.Id);
    }
    
    public void UpdateStation(Station station)
    {
        _dbContext.Update(station);
        _dbContext.SaveChanges();
    }

    public void DeleteStation(int id)
    {
        Station station = _dbContext.Station.FirstOrDefault(s => s.Id == id) ?? throw new Exception("Station not found");
        var rides = _dbContext.Ride.Where(r => r.StartStationId == id || r.EndStationId == id);
        foreach (var ride in rides)
        {
            _dbContext.Remove(ride);
        }
        var reservations = _dbContext.Reservation.Where(r => r.StationId == id);
        foreach (var reservation in reservations)
        {
            _dbContext.Remove(reservation);
        }
        var bikes = _dbContext.Bike.Where(b => b.CurrentStationId == id);
        foreach (var bike in bikes)
        {
            bike.CurrentStationId = null;
        }
        _dbContext.Remove(station);
        _dbContext.SaveChanges();
    }
}