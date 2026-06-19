using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SmartBudgetPro.Application.Common.Security;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartBudgetPro.Application.Interfaces;

namespace SmartBudgetPro.Infrastructure.Security;

public class JwtTokenGenerator(IOptions<JwtSettings> jwtSettingsOptions) : IJwtTokenGenerator
{
    private readonly JwtSettings _jwtSettings = jwtSettingsOptions.Value;

    public JwtTokenResult Generate(Guid userId, string email, string name, bool isPremium = false)
    {
        if (string.IsNullOrWhiteSpace(_jwtSettings.Issuer))
            throw new InvalidOperationException("JWT issuer is not configured.");

        if (string.IsNullOrWhiteSpace(_jwtSettings.Audience))
            throw new InvalidOperationException("JWT audience is not configured.");

        if (string.IsNullOrWhiteSpace(_jwtSettings.Key))
            throw new InvalidOperationException("JWT key is not configured.");

        if (_jwtSettings.ExpiresInMinutes <= 0)
            throw new InvalidOperationException("JWT expiration must be greater than zero.");

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key)),
            SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Name, name),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("isPremium", isPremium.ToString().ToLower())
        };

        var expiresInSeconds = _jwtSettings.ExpiresInMinutes * 60;
        var expires = DateTime.UtcNow.AddSeconds(expiresInSeconds);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: signingCredentials);

        return new JwtTokenResult(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresInSeconds);
    }
}