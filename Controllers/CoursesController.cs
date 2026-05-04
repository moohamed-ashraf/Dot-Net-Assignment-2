using CourseForge.Api.DTOs.Course;
using CourseForge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseForge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly CourseService _courseService;

    public CoursesController(CourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _courseService.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _courseService.GetByIdAsync(id);
        if (course is null)
            return NotFound(new { message = "Course not found." });

        return Ok(course);
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CourseCreateDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var created = await _courseService.CreateAsync(dto);
        if (created is null)
            return BadRequest(new { message = "Instructor does not exist or is not an instructor." });

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CourseUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var updated = await _courseService.UpdateAsync(id, dto);
        if (!updated)
            return BadRequest(new { message = "Course not found or instructor is invalid." });

        return NoContent();
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _courseService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "Course not found." });

        return NoContent();
    }
}
