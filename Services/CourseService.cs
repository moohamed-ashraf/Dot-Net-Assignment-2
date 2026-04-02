using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Courses;
using CourseForge.Api.DTOs.Enrollments;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class CourseService : ICourseService
{
    private readonly ApplicationDbContext _context;

    public CourseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseResponseDto>> GetAllAsync()
    {
        return await _context.Courses
            .AsNoTracking()
            .Select(c => new CourseResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Code = c.Code,
                CreditHours = c.CreditHours,
                Price = c.Price,
                Capacity = c.Capacity,
                InstructorName = c.Instructor != null ? c.Instructor.FullName : string.Empty,
                EnrolledStudentsCount = c.Enrollments.Count
            })
            .ToListAsync();
    }

    public async Task<CourseResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CourseResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Code = c.Code,
                CreditHours = c.CreditHours,
                Price = c.Price,
                Capacity = c.Capacity,
                InstructorName = c.Instructor != null ? c.Instructor.FullName : string.Empty,
                EnrolledStudentsCount = c.Enrollments.Count
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CourseResponseDto> CreateAsync(CreateCourseDto dto)
    {
        var instructorExists = await _context.Instructors.AnyAsync(i => i.Id == dto.InstructorId);
        if (!instructorExists)
            throw new InvalidOperationException("Instructor not found.");

        var entity = new Course
        {
            Title = dto.Title,
            Code = dto.Code,
            CreditHours = dto.CreditHours,
            Price = dto.Price,
            Capacity = dto.Capacity,
            InstructorId = dto.InstructorId
        };

        _context.Courses.Add(entity);
        await _context.SaveChangesAsync();

        var instructorName = await _context.Instructors
            .AsNoTracking()
            .Where(i => i.Id == dto.InstructorId)
            .Select(i => i.FullName)
            .FirstAsync();

        return new CourseResponseDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Code = entity.Code,
            CreditHours = entity.CreditHours,
            Price = entity.Price,
            Capacity = entity.Capacity,
            InstructorName = instructorName,
            EnrolledStudentsCount = 0
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var entity = await _context.Courses.FirstOrDefaultAsync(c => c.Id == id);
        if (entity is null) return false;

        entity.Title = dto.Title;
        entity.Code = dto.Code;
        entity.CreditHours = dto.CreditHours;
        entity.Price = dto.Price;
        entity.Capacity = dto.Capacity;
        entity.InstructorId = dto.InstructorId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Courses.FirstOrDefaultAsync(c => c.Id == id);
        if (entity is null) return false;

        _context.Courses.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> EnrollStudentAsync(CreateEnrollmentDto dto)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == dto.StudentId);
        var course = await _context.Courses.Include(c => c.Enrollments).FirstOrDefaultAsync(c => c.Id == dto.CourseId);

        if (!studentExists || course is null) return false;
        if (course.Enrollments.Count >= course.Capacity) throw new InvalidOperationException("Course capacity is full.");

        var alreadyEnrolled = await _context.Enrollments.AnyAsync(e => e.StudentId == dto.StudentId && e.CourseId == dto.CourseId);
        if (alreadyEnrolled) throw new InvalidOperationException("Student is already enrolled in this course.");

        _context.Enrollments.Add(new Enrollment
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId,
            Status = "Active"
        });

        await _context.SaveChangesAsync();
        return true;
    }
}
