﻿namespace server.Models;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
    public bool Revoked { get; set; }
    public string UserId { get; set; } = string.Empty;
}