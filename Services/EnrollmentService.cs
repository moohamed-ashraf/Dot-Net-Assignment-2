using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Enrollment;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class EnrollmentService
{
    private const string StudentRole = "Student";
    private readonly AppDbContext _context;

    public EnrollmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EnrollmentReadDto>> GetAllAsync()
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Include(e => e.User)
            .Include(e => e.Course)
            .Select(e => new EnrollmentReadDto
            {
                UserId = e.UserId,
                UserName = e.User != null ? e.User.Name : string.Empty,
                CourseId = e.CourseId,
                CourseTitle = e.Course != null ? e.Course.Title : string.Empty
            })
            .ToListAsync();
    }

    public async Task<EnrollmentReadDto?> CreateAsync(EnrollmentCreateDto dto)
    {
        var student = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == dto.UserId && u.Role == StudentRole);

        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == dto.CourseId);

        if (student is null || course is null)
            return null;

        var alreadyExists = await _context.Enrollments.AnyAsync(e =>
            e.UserId == dto.UserId && e.CourseId == dto.CourseId);

        if (alreadyExists)
            return null;

        _context.Enrollments.Add(new Enrollment
        {
            UserId = dto.UserId,
            CourseId = dto.CourseId
        });

        await _context.SaveChangesAsync();

        return new EnrollmentReadDto
        {
            UserId = dto.UserId,
            UserName = student.Name,
            CourseId = dto.CourseId,
            CourseTitle = course.Title
        };
    }

    public async Task<bool> DeleteAsync(int userId, int courseId)
    {
        var enrollment = await _context.Enrollments.FindAsync(userId, courseId);
        if (enrollment is null)
            return false;

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();
        return true;
    }
}
