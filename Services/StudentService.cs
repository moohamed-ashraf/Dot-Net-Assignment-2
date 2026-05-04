using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Students;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class StudentService : IStudentService
{
    private readonly ApplicationDbContext _context;

    public StudentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentResponseDto>> GetAllAsync()
    {
        return await _context.Students
            .AsNoTracking()
            .Select(s => new StudentResponseDto
            {
                Id = s.Id,
                FullName = s.FullName,
                Email = s.Email,
                Age = s.Age,
                Level = s.Level,
                EnrolledCoursesCount = s.Enrollments.Count
            })
            .ToListAsync();
    }

    public async Task<StudentResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Students
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new StudentResponseDto
            {
                Id = s.Id,
                FullName = s.FullName,
                Email = s.Email,
                Age = s.Age,
                Level = s.Level,
                EnrolledCoursesCount = s.Enrollments.Count
            })
            .FirstOrDefaultAsync();
    }

    public async Task<StudentResponseDto> CreateAsync(CreateStudentDto dto)
    {
        var entity = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Age = dto.Age,
            Level = dto.Level
        };

        _context.Students.Add(entity);
        await _context.SaveChangesAsync();

        return new StudentResponseDto
        {
            Id = entity.Id,
            FullName = entity.FullName,
            Email = entity.Email,
            Age = entity.Age,
            Level = entity.Level,
            EnrolledCoursesCount = 0
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateStudentDto dto)
    {
        var entity = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);
        if (entity is null) return false;

        entity.FullName = dto.FullName;
        entity.Email = dto.Email;
        entity.Age = dto.Age;
        entity.Level = dto.Level;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Students.FirstOrDefaultAsync(s => s.Id == id);
        if (entity is null) return false;

        _context.Students.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
