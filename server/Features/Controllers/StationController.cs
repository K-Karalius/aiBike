using Microsoft.AspNetCore.Mvc;
using server.Features.Services;
using server.Models;

namespace server.Features.Controllers;

[ApiController]
[Route("station")]
public class StationController : Controller
{
    private readonly StationService _stationService;
    
    public StationController(StationService stationService)
    {
        _stationService = stationService;
    }

    [HttpGet]
    [Route("")]
    public IActionResult GetAllStations()
    {
        return Ok(_stationService.GetAllStations());
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetStation(int id)
    {
        Station? Station = _stationService.GetStation(id);
        if (Station == null) return NotFound("Station not found");
        return Ok(Station);
    }

    [HttpPost]
    public IActionResult CreateStation([FromBody] Station Station)
    {
        var ret = _stationService.CreateStation(Station);
        if (ret == null) return UnprocessableEntity("");
        return Ok(ret);
    }

    [HttpPatch]
    public IActionResult UpdateStation([FromBody] Station Station)
    {
        _stationService.UpdateStation(Station);
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult DeleteStation(int id)
    {
        try
        {
            _stationService.DeleteStation(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}