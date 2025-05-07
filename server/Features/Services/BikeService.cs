using server.Features.Repositories;
using server.Models;

namespace server.Features.Services;

public class BikeService
{
    private readonly BikeRepository _bikeRepository;
    
    public BikeService(BikeRepository bikeRepository)
    {
        _bikeRepository = bikeRepository;
    }

    public ICollection<Bike> GetAllBikes()
    {
        return _bikeRepository.GetAllBikes();
    }

    public Bike? GetBike(int id)
    {
        return _bikeRepository.GetBike(id);
    }

    public Bike? CreateBike(Bike bike)
    {
        return _bikeRepository.CreateBike(bike);
    }

    public void UpdateBike(Bike bike)
    {
        _bikeRepository.UpdateBike(bike);
    }

    public void DeleteBike(int id)
    {
        _bikeRepository.DeleteBike(id);
    }
}