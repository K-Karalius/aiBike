using server.DatabaseContext;
using server.Models;

namespace server.Features.Repositories;

public class ReservationRepository
{
    private readonly ApplicationDbContext _dbContext;

    public ReservationRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ICollection<Reservation> GetAllReservations()
    {
        return [.. _dbContext.Reservation];
    }

    public Reservation? GetReservation(int id)
    {
        return _dbContext.Reservation.FirstOrDefault(r => r.Id == id);
    }

    public Reservation? CreateReservation(Reservation reservation)
    {
        _dbContext.Add(reservation);
        _dbContext.SaveChanges();
        return _dbContext.Reservation.Find(reservation.Id);
    }
    
    public void UpdateReservation(Reservation Reservation)
    {
        _dbContext.Update(Reservation);
        _dbContext.SaveChanges();
    }

    public void DeleteReservation(int id)
    {
        Reservation Reservation = _dbContext.Reservation.FirstOrDefault(r => r.Id == id) ?? throw new Exception("Reservation not found");
        _dbContext.Remove(Reservation);
        _dbContext.SaveChanges();
    }
}