using server.Features.Repositories;
using server.Models;

namespace server.Features.Services;

public class ReservationService
{
    private readonly ReservationRepository _reservationRepository;
    
    public ReservationService(ReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    public ICollection<Reservation> GetAllReservations()
    {
        return _reservationRepository.GetAllReservations();
    }

    public Reservation? GetReservation(int id)
    {
        return _reservationRepository.GetReservation(id);
    }

    public Reservation? CreateReservation(Reservation Reservation)
    {
        return _reservationRepository.CreateReservation(Reservation);
    }

    public void UpdateReservation(Reservation Reservation)
    {
        _reservationRepository.UpdateReservation(Reservation);
    }

    public void DeleteReservation(int id)
    {
        _reservationRepository.DeleteReservation(id);
    }
}