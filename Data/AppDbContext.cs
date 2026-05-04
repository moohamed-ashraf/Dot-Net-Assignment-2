using CourseForge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseForge.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<InstructorProfile> InstructorProfiles => Set<InstructorProfile>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.Property(u => u.Name).HasMaxLength(100);
            e.Property(u => u.Email).HasMaxLength(120);
            e.Property(u => u.PasswordHash).HasMaxLength(500);
            e.Property(u => u.Role).HasMaxLength(20);
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Course>(e =>
        {
            e.Property(c => c.Title).HasMaxLength(120);
            e.Property(c => c.Description).HasMaxLength(2000);
        });

        modelBuilder.Entity<InstructorProfile>(e =>
        {
            e.Property(p => p.Bio).HasMaxLength(2000);
        });

        modelBuilder.Entity<User>()
            .HasOne(u => u.InstructorProfile)
            .WithOne(p => p.User)
            .HasForeignKey<InstructorProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.CoursesTeaching)
            .WithOne(c => c.Instructor)
            .HasForeignKey(c => c.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Enrollment>().HasKey(x => new { x.UserId, x.CourseId });

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.User)
            .WithMany(u => u.Enrollments)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany(c => c.Enrollments)
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
