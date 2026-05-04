using CourseForge.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Data;

/// <summary>Sample data so Swagger login works on first run (optional convenience).</summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var hasher = new PasswordHasher<User>();

        var admin = new User
        {
            Name = "System Administrator",
            Email = "admin@courseforge.com",
            Role = "Admin"
        };
        admin.PasswordHash = hasher.HashPassword(admin, "admin123");

        var instructor = new User
        {
            Name = "Dr. Mona Hassan",
            Email = "mona@courseforge.com",
            Role = "Instructor"
        };
        instructor.PasswordHash = hasher.HashPassword(instructor, "Instructor123");

        var student = new User
        {
            Name = "Omar Ahmed",
            Email = "omar@student.com",
            Role = "Student"
        };
        student.PasswordHash = hasher.HashPassword(student, "Student123");

        context.Users.AddRange(admin, instructor, student);
        await context.SaveChangesAsync();

        context.InstructorProfiles.Add(new InstructorProfile
        {
            Bio = "Backend engineering instructor (ASP.NET Core, EF Core).",
            UserId = instructor.Id
        });

        var course = new Course
        {
            Title = "Backend Engineering with ASP.NET Core",
            Description = "Build APIs with ASP.NET Core, EF Core, PostgreSQL, and JWT auth.",
            InstructorId = instructor.Id
        };

        context.Courses.Add(course);
        await context.SaveChangesAsync();

        context.Enrollments.Add(new Enrollment
        {
            UserId = student.Id,
            CourseId = course.Id
        });

        await context.SaveChangesAsync();
    }
}
