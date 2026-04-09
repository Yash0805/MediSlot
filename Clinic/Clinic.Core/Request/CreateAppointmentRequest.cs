namespace Clinic.Core.Request;

public sealed class CreateAppointmentRequest
{
    public required string Name { get; set; }
    public required string Phone { get; set; }
    public required int Age { get; set; }
    public required string Description { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public int TimeSlotId { get; set; }
}
