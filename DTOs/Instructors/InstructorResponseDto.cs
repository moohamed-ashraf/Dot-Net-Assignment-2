namespace CourseForge.Api.DTOs.Instructors;

public class InstructorResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string OfficeLocation { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string? LinkedInUrl { get; set; }
    public int CoursesCount { get; set; }
}
