using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Instructors;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class InstructorService : IInstructorService
{
    private readonly ApplicationDbContext _context;

    public InstructorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<InstructorResponseDto>> GetAllAsync()
    {
        return await _context.Instructors
            .AsNoTracking()
            .Select(i => new InstructorResponseDto
            {
                Id = i.Id,
                FullName = i.FullName,
                Email = i.Email,
                Department = i.Department,
                OfficeLocation = i.Profile != null ? i.Profile.OfficeLocation : string.Empty,
                Bio = i.Profile != null ? i.Profile.Bio : string.Empty,
                LinkedInUrl = i.Profile!.LinkedInUrl,
                CoursesCount = i.Courses.Count
            })
            .ToListAsync();
    }

    public async Task<InstructorResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Instructors
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new InstructorResponseDto
            {
                Id = i.Id,
                FullName = i.FullName,
                Email = i.Email,
                Department = i.Department,
                OfficeLocation = i.Profile != null ? i.Profile.OfficeLocation : string.Empty,
                Bio = i.Profile != null ? i.Profile.Bio : string.Empty,
                LinkedInUrl = i.Profile!.LinkedInUrl,
                CoursesCount = i.Courses.Count
            })
            .FirstOrDefaultAsync();
    }

    public async Task<InstructorResponseDto> CreateAsync(CreateInstructorDto dto)
    {
        var entity = new Instructor
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Department = dto.Department,
            Profile = new InstructorProfile
            {
                OfficeLocation = dto.OfficeLocation,
                Bio = dto.Bio,
                LinkedInUrl = dto.LinkedInUrl
            }
        };

        _context.Instructors.Add(entity);
        await _context.SaveChangesAsync();

        return new InstructorResponseDto
        {
            Id = entity.Id,
            FullName = entity.FullName,
            Email = entity.Email,
            Department = entity.Department,
            OfficeLocation = entity.Profile?.OfficeLocation ?? string.Empty,
            Bio = entity.Profile?.Bio ?? string.Empty,
            LinkedInUrl = entity.Profile?.LinkedInUrl,
            CoursesCount = 0
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateInstructorDto dto)
    {
        var entity = await _context.Instructors.Include(i => i.Profile).FirstOrDefaultAsync(i => i.Id == id);
        if (entity is null) return false;

        entity.FullName = dto.FullName;
        entity.Email = dto.Email;
        entity.Department = dto.Department;
        entity.Profile ??= new InstructorProfile();
        entity.Profile.OfficeLocation = dto.OfficeLocation;
        entity.Profile.Bio = dto.Bio;
        entity.Profile.LinkedInUrl = dto.LinkedInUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Instructors.FirstOrDefaultAsync(i => i.Id == id);
        if (entity is null) return false;

        _context.Instructors.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
