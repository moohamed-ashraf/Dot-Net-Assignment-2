using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Course;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class CourseService
{
    private const string InstructorRole = "Instructor";
    private readonly AppDbContext _context;

    public CourseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseReadDto>> GetAllAsync()
    {
        return await _context.Courses
            .AsNoTracking()
            .Include(c => c.Instructor)
            .Select(c => new CourseReadDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                InstructorId = c.InstructorId,
                InstructorName = c.Instructor != null ? c.Instructor.Name : string.Empty
            })
            .ToListAsync();
    }

    public async Task<CourseReadDto?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .AsNoTracking()
            .Include(c => c.Instructor)
            .Where(c => c.Id == id)
            .Select(c => new CourseReadDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                InstructorId = c.InstructorId,
                InstructorName = c.Instructor != null ? c.Instructor.Name : string.Empty
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CourseReadDto?> CreateAsync(CourseCreateDto dto)
    {
        var instructor = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == dto.InstructorId && u.Role == InstructorRole);

        if (instructor is null)
            return null;

        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            InstructorId = dto.InstructorId
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return new CourseReadDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            InstructorId = course.InstructorId,
            InstructorName = instructor.Name
        };
    }

    public async Task<bool> UpdateAsync(int id, CourseUpdateDto dto)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course is null)
            return false;

        var instructorExists = await _context.Users
            .AnyAsync(u => u.Id == dto.InstructorId && u.Role == InstructorRole);

        if (!instructorExists)
            return false;

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.InstructorId = dto.InstructorId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course is null)
            return false;

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return true;
    }
}
