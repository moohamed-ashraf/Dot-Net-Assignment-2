using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Assignment;

public class SubmissionCreateDto
{
    [Required, MaxLength(8000)]
    public string Content { get; set; } = string.Empty;
}
