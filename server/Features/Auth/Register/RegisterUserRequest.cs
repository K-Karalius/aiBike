using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using server.Models;

namespace server.Features.Auth.Register;

public record RegisterUserRequest
{
    [Required]
    public required string Email { get; init; }
    [Required]
    public required string Password { get; init; }

    [BindNever]
    [JsonIgnore]
    public Roles Role { get; init; } = Roles.User;
};