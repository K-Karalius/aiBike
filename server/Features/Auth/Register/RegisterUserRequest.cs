using System.ComponentModel.DataAnnotations;

namespace server.Features.Auth.Register;

public record RegisterUserRequest
{
    [Required]
    public required string Email { get; init; }
    [Required]
    public required string Password { get; init; }
};