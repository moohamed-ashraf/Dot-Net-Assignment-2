using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var admin = new AppUser
        {
            Username = "admin",
            Password = "admin123",
            Role = "Admin"
        };

        var instructorUser = new AppUser
        {
            Username = "instructor1",
            Password = "Instructor123",
            Role = "Instructor"
        };

        var studentUser = new AppUser
        {
            Username = "student1",
            Password = "Student123",
            Role = "User"
        };

        var instructor = new Instructor
        {
            FullName = "Dr. Mona Hassan",
            Email = "mona@courseforge.com",
            Department = "Computer Science",
            Profile = new InstructorProfile
            {
                OfficeLocation = "Building A - 304",
                Bio = "Backend engineering instructor focused on ASP.NET Core and databases.",
                LinkedInUrl = "https://linkedin.com/in/mona-hassan"
            }
        };

        var course = new Course
        {
            Title = "Backend Engineering with ASP.NET Core",
            Code = "BE-401",
            CreditHours = 3,
            Price = 2500,
            Instructor = instructor,
            Capacity = 30
        };

        var student = new Student
        {
            FullName = "Omar Ahmed",
            Email = "omar@student.com",
            Age = 21,
            Level = 4
        };

        context.Users.AddRange(admin, instructorUser, studentUser);
        context.Instructors.Add(instructor);
        context.Courses.Add(course);
        context.Students.Add(student);
        context.Enrollments.Add(new Enrollment
        {
            Student = student,
            Course = course,
            EnrolledAt = DateTime.UtcNow,
            Status = "Active"
        });

        await context.SaveChangesAsync();
    }
}
