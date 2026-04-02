using CourseForge.Api.DTOs.Instructors;

namespace CourseForge.Api.Services;

public interface IInstructorService
{
    Task<List<InstructorResponseDto>> GetAllAsync();
    Task<InstructorResponseDto?> GetByIdAsync(int id);
    Task<InstructorResponseDto> CreateAsync(CreateInstructorDto dto);
    Task<bool> UpdateAsync(int id, UpdateInstructorDto dto);
    Task<bool> DeleteAsync(int id);
}
