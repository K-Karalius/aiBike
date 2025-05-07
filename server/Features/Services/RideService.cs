using server.Features.Repositories;
using server.Models;

namespace server.Features.Services;

public class RideService
{
    private readonly RideRepository _rideRepository;
    
    public RideService(RideRepository rideRepository)
    {
        _rideRepository = rideRepository;
    }

    public ICollection<Ride> GetAllRides()
    {
        return _rideRepository.GetAllRides();
    }

    public Ride? GetRide(int id)
    {
        return _rideRepository.GetRide(id);
    }

    public Ride? CreateRide(Ride Ride)
    {
        return _rideRepository.CreateRide(Ride);
    }

    public void UpdateRide(Ride Ride)
    {
        _rideRepository.UpdateRide(Ride);
    }

    public void DeleteRide(int id)
    {
        _rideRepository.DeleteRide(id);
    }
}