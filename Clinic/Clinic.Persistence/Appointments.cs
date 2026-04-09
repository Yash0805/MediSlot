using System.ComponentModel.DataAnnotations;

namespace Clinic.Persistence;

public sealed class Appointments
{
    [Key] public int Id { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public int Age { get; set; }
    public string Description { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public int TimeSlotId { get; set; }
    public string? Status { get; set; }
    public TimeSlots? TimeSlot { get; set; }
}
