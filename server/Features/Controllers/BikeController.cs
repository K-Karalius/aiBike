using Microsoft.AspNetCore.Mvc;
using server.Features.Services;
using server.Models;

namespace server.Features.Controllers;

[ApiController]
[Route("bike")]
public class BikeController : Controller
{
    private readonly BikeService _bikeService;
    
    public BikeController(BikeService bikeService)
    {
        _bikeService = bikeService;
    }

    [HttpGet]
    [Route("")]
    public IActionResult GetAllBikes()
    {
        return Ok(_bikeService.GetAllBikes());
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetBike(int id)
    {
        Bike? bike = _bikeService.GetBike(id);
        if (bike == null) return NotFound("Bike not found");
        return Ok(bike);
    }

    [HttpPost]
    public IActionResult CreateBike([FromBody] Bike bike)
    {
        var ret = _bikeService.CreateBike(bike);
        if (ret == null) return UnprocessableEntity("");
        return Ok(ret);
    }

    [HttpPatch]
    public IActionResult UpdateBike([FromBody] Bike bike)
    {
        _bikeService.UpdateBike(bike);
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult DeleteBike(int id)
    {
        try
        {
            _bikeService.DeleteBike(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}