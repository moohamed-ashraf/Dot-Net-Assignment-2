using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.Models;

public class Student : BaseEntity
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(120)]
    public string Email { get; set; } = string.Empty;

    [Range(16, 70)]
    public int Age { get; set; }

    [Range(1, 10)]
    public int Level { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
