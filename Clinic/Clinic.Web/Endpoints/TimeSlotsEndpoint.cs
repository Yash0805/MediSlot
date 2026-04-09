using Clinic.Core.Dtos;
using Clinic.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Clinic.Web.Endpoints;

public static class TimeSlotsEndpoint
{
    public static IEndpointRouteBuilder MapTimeSlotsEndpoints(this IEndpointRouteBuilder endpoint)
    {
        ArgumentNullException.ThrowIfNull(endpoint);
        endpoint.MapGet("TimeSlots", GetTimeSlotsList);
        return endpoint;
    }

    private static Ok<IEnumerable<TimeSlotsDto>> GetTimeSlotsList(TimeSlotsService timeSlotsService)
    {
        IEnumerable<TimeSlotsDto> timeSlots = timeSlotsService.GetTimeSlotsList();
        return TypedResults.Ok(timeSlots);
    }
}
