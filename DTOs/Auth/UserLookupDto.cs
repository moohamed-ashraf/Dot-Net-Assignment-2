namespace CourseForge.Api.DTOs.Auth;

public class UserLookupDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
