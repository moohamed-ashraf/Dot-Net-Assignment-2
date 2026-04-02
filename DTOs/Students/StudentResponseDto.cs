namespace CourseForge.Api.DTOs.Students;

public class StudentResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Age { get; set; }
    public int Level { get; set; }
    public int EnrolledCoursesCount { get; set; }
}
