namespace server.Features.Auth.Login;

public record AuthResponse(string AccessToken, string RefreshToken);