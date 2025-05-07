using server.DatabaseContext;
using server.Models;

namespace server.Features.Repositories;

public class RideRepository
{
    private readonly ApplicationDbContext _dbContext;

    public RideRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ICollection<Ride> GetAllRides()
    {
        return [.. _dbContext.Ride];
    }

    public Ride? GetRide(int id)
    {
        return _dbContext.Ride.FirstOrDefault(r => r.Id == id);
    }

    public Ride? CreateRide(Ride ride)
    {
        _dbContext.Add(ride);
        _dbContext.SaveChanges();
        return _dbContext.Ride.Find(ride.Id);
    }
    
    public void UpdateRide(Ride ride)
    {
        _dbContext.Update(ride);
        _dbContext.SaveChanges();
    }

    public void DeleteRide(int id)
    {
        Ride Ride = _dbContext.Ride.FirstOrDefault(r => r.Id == id) ?? throw new Exception("Ride not found");
        _dbContext.Remove(Ride);
        _dbContext.SaveChanges();
    }
}