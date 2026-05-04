using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Instructors;

public class CreateInstructorDto
{
    [Required, MinLength(3), MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string OfficeLocation { get; set; } = string.Empty;

    [Required, MinLength(20), MaxLength(500)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? LinkedInUrl { get; set; }
}
