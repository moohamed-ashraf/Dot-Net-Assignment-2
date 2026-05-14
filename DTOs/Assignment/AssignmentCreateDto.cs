using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Assignment;

public class AssignmentCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime DueDate { get; set; }
}
