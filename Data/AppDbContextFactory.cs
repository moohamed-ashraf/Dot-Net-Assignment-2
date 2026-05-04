using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CourseForge.Api.Data;

/// <summary>Allows <c>dotnet ef</c> commands without running the web app.</summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var conn = Environment.GetEnvironmentVariable("CF_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=assingment2_db;Username=postgres;Password=1234";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(conn)
            .Options;

        return new AppDbContext(options);
    }
}
