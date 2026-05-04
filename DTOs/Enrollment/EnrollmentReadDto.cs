namespace CourseForge.Api.DTOs.Enrollment;

public class EnrollmentReadDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
}
