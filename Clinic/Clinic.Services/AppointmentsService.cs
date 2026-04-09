using Clinic.Core.Dtos;
using Clinic.Core.Request;
using Clinic.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clinic.Services;

public sealed class AppointmentsService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<AppointmentsService> _logger;

    public AppointmentsService(AppDbContext dbContext, ILogger<AppointmentsService> logger)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public IEnumerable<AppointmentsDto> GetAppointmentsList(DateTime? date = null)
    {
        IQueryable<Appointments> query = _dbContext.Appointments
            .Include(t => t.TimeSlot)
            .AsQueryable();

        if (date.HasValue)
        {
            DateOnly dateOnly = DateOnly.FromDateTime(date.Value);
            query = query.Where(a => a.AppointmentDate == dateOnly);
        }

        return query
            .Select(a => new AppointmentsDto
            (
                a.Id,
                a.Name,
                a.Phone,
                a.Age,
                a.Description,
                a.AppointmentDate,
                a.TimeSlotId,
                a.TimeSlot.TimeSlot,
                a.Status
            ))
            .ToList();
    }

    public ReportDto GetReport(DateTime? date = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        IQueryable<Appointments> query = _dbContext.Appointments
            .Include(t => t.TimeSlot)
            .AsQueryable();

        if (date.HasValue)
        {
            DateOnly dateOnly = DateOnly.FromDateTime(date.Value);
            query = query.Where(a => a.AppointmentDate == dateOnly);
        }
        else if (fromDate.HasValue && toDate.HasValue)
        {
            DateOnly fromDateOnly = DateOnly.FromDateTime(fromDate.Value);
            DateOnly toDateOnly = DateOnly.FromDateTime(toDate.Value);

            query = query.Where(a => a.AppointmentDate >= fromDateOnly && a.AppointmentDate <= toDateOnly);
        }

        List<Appointments> data = query.ToList();
        int total = data.Count;
        int appearedCount = data.Count(a => a.Status == "Appeared");
        int noShowCount = data.Count(a => a.Status == "NoShow");

        List<AppointmentsDto> appointments = data
            .Select(a => new AppointmentsDto(
                a.Id,
                a.Name,
                a.Phone,
                a.Age,
                a.Description,
                a.AppointmentDate,
                a.TimeSlotId,
                a.TimeSlot.TimeSlot,
                a.Status
            ))
            .ToList();

        return new ReportDto(total, appearedCount, noShowCount, appointments);
    }

    public AppointmentsDto CreateAppointmentRequest(CreateAppointmentRequest request)
    {
        TimeSlots? timeSlot = _dbContext.TimeSlots
            .FirstOrDefault(t => t.Id == request.TimeSlotId);

        if (timeSlot == null)
        {
            throw new Exception("Invalid TimeSlotId");
        }

        bool isSlotBooked = _dbContext.Appointments
            .Any(a => a.AppointmentDate == request.AppointmentDate
                      && a.TimeSlotId == request.TimeSlotId);

        if (isSlotBooked)
        {
            throw new Exception("This time slot is already booked");
        }

        Appointments appointment = new()
        {
            Name = request.Name,
            Phone = request.Phone,
            Age = request.Age,
            Description = request.Description,
            AppointmentDate = request.AppointmentDate,
            TimeSlotId = request.TimeSlotId
        };

        _dbContext.Appointments.Add(appointment);
        _dbContext.SaveChanges();

        return new AppointmentsDto(
            appointment.Id,
            appointment.Name,
            appointment.Phone,
            appointment.Age,
            appointment.Description,
            appointment.AppointmentDate,
            appointment.TimeSlotId,
            timeSlot.TimeSlot,
            appointment.Status
        );
    }

    public AppointmentsDto? PatchAppointmentRequest(int Id)
    {
        try
        {
            Appointments? appointment = _dbContext.Appointments
                .Include(t => t.TimeSlot)
                .FirstOrDefault(a => a.Id == Id);
            if (appointment == null)
            {
                return null;
            }

            appointment.Status = "Appeared";
            _dbContext.SaveChanges();
            return new AppointmentsDto(
                appointment.Id,
                appointment.Name,
                appointment.Phone,
                appointment.Age,
                appointment.Description,
                appointment.AppointmentDate,
                appointment.TimeSlotId,
                appointment.TimeSlot.TimeSlot,
                appointment.Status
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating appointment");
            return null;
        }
    }
}
