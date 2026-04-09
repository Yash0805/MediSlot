using System.ComponentModel.DataAnnotations;

namespace Clinic.Persistence;

public sealed class TimeSlots
{
    [Key] public int Id { get; set; }
    public TimeOnly TimeSlot { get; set; }
    public IList<Appointments> Appointments { get; init; } = [];
}
