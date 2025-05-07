using Microsoft.AspNetCore.Mvc;
using server.Features.Services;
using server.Models;

namespace server.Features.Controllers;

[ApiController]
[Route("Ride")]
public class RideController : Controller
{
    private readonly RideService _rideService;
    
    public RideController(RideService rideService)
    {
        _rideService = rideService;
    }

    [HttpGet]
    [Route("")]
    public IActionResult GetAllRides()
    {
        return Ok(_rideService.GetAllRides());
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetRide(int id)
    {
        Ride? Ride = _rideService.GetRide(id);
        if (Ride == null) return NotFound("Ride not found");
        return Ok(Ride);
    }

    [HttpPost]
    public IActionResult CreateRide([FromBody] Ride Ride)
    {
        var ret = _rideService.CreateRide(Ride);
        if (ret == null) return UnprocessableEntity("");
        return Ok();
    }

    [HttpPatch]
    public IActionResult UpdateRide([FromBody] Ride Ride)
    {
        _rideService.UpdateRide(Ride);
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult DeleteRide(int id)
    {
        try
        {
            _rideService.DeleteRide(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}