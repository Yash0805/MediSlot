namespace Clinic.Core.Dtos;

public sealed class AppointmentsDto(
    int Id,
    string Name,
    string Phone,
    int Age,
    string Description,
    DateOnly AppointmentDate,
    int TimeSlotId,
    TimeOnly TimeSlot,
    string Status)
{
    public int Id { get; } = Id;
    public string Name { get; } = Name;
    public string Phone { get; } = Phone;
    public int Age { get; } = Age;
    public string Description { get; } = Description;
    public DateOnly AppointmentDate { get; } = AppointmentDate;
    public int TimeSlotId { get; } = TimeSlotId;
    public TimeOnly TimeSlot { get; } = TimeSlot;
    public string Status { get; } = Status;
}
