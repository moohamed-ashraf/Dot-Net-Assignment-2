namespace CourseForge.Api.Models;

public class InstructorProfile
{
    public int Id { get; set; }
    public string Bio { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User? User { get; set; }
}
