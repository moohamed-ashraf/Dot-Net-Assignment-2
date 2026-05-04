using CourseForge.Api.DTOs.Courses;
using CourseForge.Api.DTOs.Enrollments;

namespace CourseForge.Api.Services;

public interface ICourseService
{
    Task<List<CourseResponseDto>> GetAllAsync();
    Task<CourseResponseDto?> GetByIdAsync(int id);
    Task<CourseResponseDto> CreateAsync(CreateCourseDto dto);
    Task<bool> UpdateAsync(int id, UpdateCourseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> EnrollStudentAsync(CreateEnrollmentDto dto);
}
