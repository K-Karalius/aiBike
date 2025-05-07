using server.Features.Repositories;
using server.Models;

namespace server.Features.Services;

public class StationService
{
    private readonly StationRepository _stationRepository;
    
    public StationService(StationRepository stationRepository)
    {
        _stationRepository = stationRepository;
    }

    public ICollection<Station> GetAllStations()
    {
        return _stationRepository.GetAllStations();
    }

    public Station? GetStation(int id)
    {
        return _stationRepository.GetStation(id);
    }

    public Station? CreateStation(Station Station)
    {
        return _stationRepository.CreateStation(Station);
    }

    public void UpdateStation(Station Station)
    {
        _stationRepository.UpdateStation(Station);
    }

    public void DeleteStation(int id)
    {
        _stationRepository.DeleteStation(id);
    }
}