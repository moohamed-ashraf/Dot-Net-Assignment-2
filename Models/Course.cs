using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.Models;

public class Course : BaseEntity
{
    [Required, MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    [Range(1, 6)]
    public int CreditHours { get; set; }

    [Range(0, 100000)]
    public decimal Price { get; set; }

    [Range(1, 1000)]
    public int Capacity { get; set; }

    public int InstructorId { get; set; }
    public Instructor? Instructor { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
