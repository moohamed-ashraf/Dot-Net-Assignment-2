using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Enrollment;

public class EnrollmentCreateDto
{
    [Range(1, int.MaxValue)]
    public int UserId { get; set; }

    [Range(1, int.MaxValue)]
    public int CourseId { get; set; }
}
