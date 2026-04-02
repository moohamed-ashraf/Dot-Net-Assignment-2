using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.DTOs.Students;

public class CreateStudentDto
{
    [Required, MinLength(3), MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Range(16, 70)]
    public int Age { get; set; }

    [Range(1, 10)]
    public int Level { get; set; }
}
