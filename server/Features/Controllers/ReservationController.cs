using Microsoft.AspNetCore.Mvc;
using server.Features.Services;
using server.Models;

namespace server.Features.Controllers;

[ApiController]
[Route("reservation")]
public class ReservationController : Controller
{
    private readonly ReservationService _reservationService;
    
    public ReservationController(ReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    [HttpGet]
    [Route("")]
    public IActionResult GetAllReservations()
    {
        return Ok(_reservationService.GetAllReservations());
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetReservation(int id)
    {
        Reservation? Reservation = _reservationService.GetReservation(id);
        if (Reservation == null) return NotFound("Reservation not found");
        return Ok(Reservation);
    }

    [HttpPost]
    public IActionResult CreateReservation([FromBody] Reservation Reservation)
    {
        var ret = _reservationService.CreateReservation(Reservation);
        if (ret == null) return UnprocessableEntity("");
        return Ok();
    }

    [HttpPatch]
    public IActionResult UpdateReservation([FromBody] Reservation Reservation)
    {
        _reservationService.UpdateReservation(Reservation);
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult DeleteReservation(int id)
    {
        try
        {
            _reservationService.DeleteReservation(id);
            return Ok();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}