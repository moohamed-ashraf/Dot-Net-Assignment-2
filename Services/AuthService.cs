using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Auth;
using CourseForge.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CourseForge.Api.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user is null)
            return null;

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
            return null;

        if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            await _context.SaveChangesAsync();
        }

        return new AuthResponseDto
        {
            UserId = user.Id,
            Token = GenerateJwtToken(user),
            Role = user.Role,
            Email = user.Email,
            Name = user.Name
        };
    }

    public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto)
    {
        var allowedRoles = new[] { "Admin", "Instructor", "Student" };
        if (!allowedRoles.Contains(dto.Role))
            return (false, "Role must be Admin, Instructor, or Student.");

        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists)
            return (false, "Email is already registered.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = dto.Role
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (user.Role == "Instructor")
        {
            _context.InstructorProfiles.Add(new InstructorProfile
            {
                Bio = "",
                UserId = user.Id
            });
            await _context.SaveChangesAsync();
        }

        return (true, "User registered successfully.");
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
