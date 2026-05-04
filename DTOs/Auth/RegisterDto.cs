using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Auth;

public class RegisterDto
{
    [Required, MinLength(2), MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    /// <summary>Admin, Instructor, or Student</summary>
    [Required, MaxLength(20)]
    public string Role { get; set; } = string.Empty;
}
