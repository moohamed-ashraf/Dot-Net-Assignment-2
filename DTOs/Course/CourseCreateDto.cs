using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Course;

public class CourseCreateDto
{
    [Required, MinLength(3), MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, MinLength(3), MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int InstructorId { get; set; }
}
