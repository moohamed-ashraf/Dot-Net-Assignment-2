namespace CourseForge.Api.DTOs.Courses;

public class CourseResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int CreditHours { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public int EnrolledStudentsCount { get; set; }
}
