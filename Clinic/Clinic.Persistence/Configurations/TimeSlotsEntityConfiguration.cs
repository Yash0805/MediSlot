using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Clinic.Persistence.Configurations;

public class TimeSlotsEntityConfiguration : IEntityTypeConfiguration<TimeSlots>
{
    public void Configure(EntityTypeBuilder<TimeSlots> builder)
    {
        builder.ToTable("TimeSlots");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TimeSlot)
            .HasColumnName("TimeSlot")
            .IsRequired();
    }
}
