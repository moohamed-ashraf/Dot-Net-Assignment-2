using CourseForge.Api.DTOs.Auth;

namespace CourseForge.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
}
