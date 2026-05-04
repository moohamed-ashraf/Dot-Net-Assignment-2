using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.Models;

public class Instructor : BaseEntity
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    public InstructorProfile? Profile { get; set; }
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
