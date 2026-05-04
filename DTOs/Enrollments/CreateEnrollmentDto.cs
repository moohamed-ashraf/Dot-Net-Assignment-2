using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Enrollments;

public class CreateEnrollmentDto
{
    [Range(1, int.MaxValue)]
    public int StudentId { get; set; }

    [Range(1, int.MaxValue)]
    public int CourseId { get; set; }
}
