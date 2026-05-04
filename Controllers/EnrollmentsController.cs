using CourseForge.Api.DTOs.Enrollment;
using CourseForge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseForge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly EnrollmentService _enrollmentService;

    public EnrollmentsController(EnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [Authorize(Roles = "Admin,Instructor")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var enrollments = await _enrollmentService.GetAllAsync();
        return Ok(enrollments);
    }

    [Authorize(Roles = "Student,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EnrollmentCreateDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var created = await _enrollmentService.CreateAsync(dto);
        if (created is null)
            return BadRequest(new { message = "Invalid student/course or enrollment already exists." });

        return Ok(created);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{userId:int}/{courseId:int}")]
    public async Task<IActionResult> Delete(int userId, int courseId)
    {
        var deleted = await _enrollmentService.DeleteAsync(userId, courseId);
        if (!deleted)
            return NotFound(new { message = "Enrollment not found." });

        return NoContent();
    }
}
