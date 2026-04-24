using Microsoft.EntityFrameworkCore;

namespace Clinic.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Appointments> Appointments { get; init; }
    public DbSet<TimeSlots> TimeSlots { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Type t = typeof(AppDbContext);
        modelBuilder.ApplyConfigurationsFromAssembly(t.Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
