using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Assignment;
using CourseForge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CourseForge.Api.Controllers;

[ApiController]
[Route("api/Courses/{courseId:int}/assignments")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly AssignmentService _assignmentService;
    private readonly AppDbContext _db;

    public AssignmentsController(AssignmentService assignmentService, AppDbContext db)
    {
        _assignmentService = assignmentService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(int courseId)
    {
        if (IsStudent())
        {
            var enrolled = await IsEnrolled(courseId);
            if (!enrolled)
                return Forbid();
        }

        var assignments = await _assignmentService.GetByCourseAsync(courseId);
        return Ok(assignments);
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(int courseId, [FromBody] AssignmentCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var created = await _assignmentService.CreateAsync(courseId, dto);
            if (created is null)
                return BadRequest(new { message = "Course not found." });

            return Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to create assignment.", detail = ex.Message });
        }
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpGet("{assignmentId:int}/submissions")]
    public async Task<IActionResult> GetSubmissions(int courseId, int assignmentId)
    {
        var submissions = await _assignmentService.GetSubmissionsAsync(courseId, assignmentId);
        return Ok(submissions);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("{assignmentId:int}/submissions/mine")]
    public async Task<IActionResult> GetMySubmission(int courseId, int assignmentId)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        if (!await IsEnrolled(courseId))
            return Forbid();

        var submission = await _assignmentService.GetMySubmissionAsync(courseId, assignmentId, userId.Value);
        if (submission is null)
            return Ok((object?)null);
        return Ok(submission);
    }

    [Authorize(Roles = "Student")]
    [HttpPost("{assignmentId:int}/submissions")]
    public async Task<IActionResult> Submit(int courseId, int assignmentId, [FromBody] SubmissionCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        if (!await IsEnrolled(courseId))
            return Forbid();

        try
        {
            var created = await _assignmentService.SubmitAsync(courseId, assignmentId, userId.Value, dto);
            if (created is null)
                return BadRequest(new { message = "Assignment not found or already submitted." });

            return Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to submit.", detail = ex.Message });
        }
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpPut("{assignmentId:int}/submissions/{submissionId:int}/grade")]
    public async Task<IActionResult> Grade(int courseId, int assignmentId, int submissionId, [FromBody] GradeDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var graded = await _assignmentService.GradeAsync(courseId, assignmentId, submissionId, dto.Grade);
            if (graded is null)
                return NotFound(new { message = "Submission not found." });

            return Ok(graded);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to grade submission.", detail = ex.Message });
        }
    }

    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }

    private bool IsStudent()
    {
        return User.IsInRole("Student");
    }

    private async Task<bool> IsEnrolled(int courseId)
    {
        var userId = GetUserId();
        if (userId is null) return false;
        return await _db.Enrollments.AnyAsync(e => e.UserId == userId.Value && e.CourseId == courseId);
    }
}
