namespace CourseForge.Api.DTOs.Assignment;

public class SubmissionReadDto
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int? Grade { get; set; }
}
