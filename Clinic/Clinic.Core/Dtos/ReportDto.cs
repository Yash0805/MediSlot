namespace Clinic.Core.Dtos;

public sealed class ReportDto(
    int TotalAppointments,
    int AppearedCount,
    int NoShowCount,
    int BookedCount,
    List<AppointmentsDto> Appointments
)
{
    public int TotalAppointments { get; } = TotalAppointments;
    public int AppearedCount { get; } = AppearedCount;
    public int NoShowCount { get; } = NoShowCount;
    public int BookedCount { get; } = BookedCount;
    public List<AppointmentsDto> Appointments { get; } = Appointments;
}
