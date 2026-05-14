namespace CourseForge.Api.DTOs.Assignment;

public class AssignmentReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public DateTime DueDate { get; set; }
}
