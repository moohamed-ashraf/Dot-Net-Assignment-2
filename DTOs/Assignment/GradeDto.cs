using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Assignment;

public class GradeDto
{
    [Required, Range(0, 100)]
    public int Grade { get; set; }
}
