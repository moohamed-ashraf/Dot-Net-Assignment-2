namespace CourseForge.Api.Models;

/// <summary>Course linked to an instructor User — same shape as CourseManagementAPI.</summary>
public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int InstructorId { get; set; }
    public User? Instructor { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
