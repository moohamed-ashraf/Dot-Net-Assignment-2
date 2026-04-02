using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.Models;

public class InstructorProfile : BaseEntity
{
    public int InstructorId { get; set; }

    [Required, MaxLength(150)]
    public string OfficeLocation { get; set; } = string.Empty;

    [Required, MinLength(20), MaxLength(500)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? LinkedInUrl { get; set; }

    public Instructor? Instructor { get; set; }
}
