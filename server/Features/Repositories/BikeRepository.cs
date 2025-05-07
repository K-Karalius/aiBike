using Microsoft.EntityFrameworkCore;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Repositories;

public class BikeRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BikeRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ICollection<Bike> GetAllBikes()
    {
        return [.. _dbContext.Bike];
    }

    public Bike? GetBike(int id)
    {
        return _dbContext.Bike.FirstOrDefault(b => b.Id == id);
    }

    public Bike? CreateBike(Bike bike)
    {
        _dbContext.Add(bike);
        _dbContext.SaveChanges();
        return _dbContext.Bike.Find(bike.Id);
    }
    
    public void UpdateBike(Bike bike)
    {
        _dbContext.Update(bike);
        _dbContext.SaveChanges();
    }

    public void DeleteBike(int id)
    {
        Bike bike = _dbContext.Bike.FirstOrDefault(b => b.Id == id) ?? throw new Exception("Bike not found");
        var rides = _dbContext.Ride.Where(r => r.BikeId == id);
        foreach (var ride in rides)
        {
            _dbContext.Remove(ride);
        }
        var reservations = _dbContext.Reservation.Where(r => r.BikeId == id);
        foreach (var reservation in reservations)
        {
            _dbContext.Remove(reservation);
        }
        _dbContext.Remove(bike);
        _dbContext.SaveChanges();
    }
}