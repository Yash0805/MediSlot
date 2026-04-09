using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Clinic.Persistence.Configurations;

public class AppointmentsEntityConfiguration : IEntityTypeConfiguration<Appointments>
{
    public void Configure(EntityTypeBuilder<Appointments> builder)
    {
        builder.ToTable("Appointments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue("NoShow");

        builder.Property(x => x.AppointmentDate)
            .IsRequired();

        builder.HasOne(x => x.TimeSlot)
            .WithMany(x => x.Appointments)
            .HasForeignKey(x => x.TimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
