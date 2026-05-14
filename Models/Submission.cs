namespace CourseForge.Api.Models;

public class Submission
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public int? Grade { get; set; }

    public int AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }

    public int StudentId { get; set; }
    public User? Student { get; set; }
}
