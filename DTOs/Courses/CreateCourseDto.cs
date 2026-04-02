using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Courses;

public class CreateCourseDto
{
    [Required, MinLength(3), MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    [Range(1, 6)]
    public int CreditHours { get; set; }

    [Range(0, 100000)]
    public decimal Price { get; set; }

    [Range(1, 1000)]
    public int Capacity { get; set; }

    [Range(1, int.MaxValue)]
    public int InstructorId { get; set; }
}
