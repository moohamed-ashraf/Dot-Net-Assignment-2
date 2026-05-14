using CourseForge.Api.Data;
using CourseForge.Api.DTOs.Assignment;
using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Services;

public class AssignmentService
{
    private readonly AppDbContext _context;

    public AssignmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AssignmentReadDto>> GetByCourseAsync(int courseId)
    {
        return await _context.Assignments
            .AsNoTracking()
            .Where(a => a.CourseId == courseId)
            .OrderBy(a => a.DueDate)
            .Select(a => new AssignmentReadDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                CourseId = a.CourseId,
                DueDate = a.DueDate
            })
            .ToListAsync();
    }

    public async Task<AssignmentReadDto?> CreateAsync(int courseId, AssignmentCreateDto dto)
    {
        var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);
        if (!courseExists) return null;

        var dueDate = dto.DueDate.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(dto.DueDate, DateTimeKind.Utc)
            : dto.DueDate.ToUniversalTime();

        var assignment = new Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dueDate,
            CourseId = courseId
        };

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return new AssignmentReadDto
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            CourseId = assignment.CourseId,
            DueDate = assignment.DueDate
        };
    }

    public async Task<List<SubmissionReadDto>> GetSubmissionsAsync(int courseId, int assignmentId)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Where(s => s.AssignmentId == assignmentId && s.Assignment!.CourseId == courseId)
            .Include(s => s.Student)
            .Select(s => new SubmissionReadDto
            {
                Id = s.Id,
                AssignmentId = s.AssignmentId,
                StudentId = s.StudentId,
                StudentName = s.Student != null ? s.Student.Name : string.Empty,
                Content = s.Content,
                SubmittedAt = s.SubmittedAt,
                Grade = s.Grade
            })
            .OrderBy(s => s.SubmittedAt)
            .ToListAsync();
    }

    public async Task<SubmissionReadDto?> GetMySubmissionAsync(int courseId, int assignmentId, int studentId)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Where(s => s.AssignmentId == assignmentId
                        && s.Assignment!.CourseId == courseId
                        && s.StudentId == studentId)
            .Include(s => s.Student)
            .Select(s => new SubmissionReadDto
            {
                Id = s.Id,
                AssignmentId = s.AssignmentId,
                StudentId = s.StudentId,
                StudentName = s.Student != null ? s.Student.Name : string.Empty,
                Content = s.Content,
                SubmittedAt = s.SubmittedAt,
                Grade = s.Grade
            })
            .FirstOrDefaultAsync();
    }

    public async Task<SubmissionReadDto?> SubmitAsync(int courseId, int assignmentId, int studentId, SubmissionCreateDto dto)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == assignmentId && a.CourseId == courseId);
        if (assignment is null) return null;

        var alreadySubmitted = await _context.Submissions
            .AnyAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId);
        if (alreadySubmitted) return null;

        var student = await _context.Users.FindAsync(studentId);
        if (student is null) return null;

        var submission = new Submission
        {
            AssignmentId = assignmentId,
            StudentId = studentId,
            Content = dto.Content,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();

        return new SubmissionReadDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            StudentId = submission.StudentId,
            StudentName = student.Name,
            Content = submission.Content,
            SubmittedAt = submission.SubmittedAt,
            Grade = submission.Grade
        };
    }

    public async Task<SubmissionReadDto?> GradeAsync(int courseId, int assignmentId, int submissionId, int grade)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == submissionId
                                      && s.AssignmentId == assignmentId
                                      && s.Assignment!.CourseId == courseId);
        if (submission is null) return null;

        submission.Grade = grade;
        await _context.SaveChangesAsync();

        return new SubmissionReadDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            StudentId = submission.StudentId,
            StudentName = submission.Student?.Name ?? string.Empty,
            Content = submission.Content,
            SubmittedAt = submission.SubmittedAt,
            Grade = submission.Grade
        };
    }
}
