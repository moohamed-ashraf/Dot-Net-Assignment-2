using System.ComponentModel.DataAnnotations;

namespace CourseForge.Api.Models;

public class AppUser : BaseEntity
{
    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Role { get; set; } = "User";
}
