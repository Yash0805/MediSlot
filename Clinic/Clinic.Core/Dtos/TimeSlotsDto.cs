namespace Clinic.Core.Dtos;

public sealed class TimeSlotsDto(
    int Id,
    TimeOnly TimeSlot)
{
    public int Id { get; } = Id;
    public TimeOnly TimeSlot { get; } = TimeSlot;
}
