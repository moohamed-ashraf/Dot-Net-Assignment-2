namespace CourseForge.Api.Models;

public class Assignment
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }

    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
