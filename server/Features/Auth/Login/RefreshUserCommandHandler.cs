using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using server.Common;
using server.Common.Abstractions;
using server.Configuration;
using server.DatabaseContext;
using server.Models;

namespace server.Features.Auth.Login;

public class RefreshUserCommandHandler(
    ApplicationDbContext dbContext,
    UserManager<IdentityUser> userManager,
    IOptions<JwtSettings> jwtOptions)
    : ICommandHandler<RefreshTokenRequest, AuthResponse>
{
    private readonly JwtSettings _jwtSettings = jwtOptions.Value;

    public async Task<Result<AuthResponse>> Handle(RefreshTokenRequest request)
    {
        var stored = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

        if (stored is null || stored.Expires < DateTime.UtcNow || stored.Revoked)
            return Result<AuthResponse>.Failure(["Invalid refresh token."]);

        var user = await userManager.FindByIdAsync(stored.UserId);
        if (user is null)
            return Result<AuthResponse>.Failure(["Invalid refresh token."]);

        stored.Revoked = true;

        var newRefreshValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var newRefreshToken = new RefreshToken
        {
            Token = newRefreshValue,
            Expires = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            UserId = user.Id
        };
        dbContext.RefreshTokens.Add(newRefreshToken);
        await dbContext.SaveChangesAsync();

        var roles = await userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!)
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var jwt = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: creds
        );
        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        return Result<AuthResponse>.Success(new AuthResponse(accessToken, newRefreshValue, roles));
    }
}
