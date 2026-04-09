using Clinic.Core.Dtos;
using Clinic.Persistence;
using Microsoft.Extensions.Logging;

namespace Clinic.Services;

public sealed class TimeSlotsService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TimeSlotsService> _logger;

    public TimeSlotsService(AppDbContext dbContext, ILogger<TimeSlotsService> logger)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public IEnumerable<TimeSlotsDto> GetTimeSlotsList()
    {
        IReadOnlyList<TimeSlotsDto> timeSlots = _dbContext.TimeSlots
            .Select
            (t => new TimeSlotsDto
            (
                t.Id,
                t.TimeSlot
            ))
            .ToList();
        return timeSlots;
    }
}
