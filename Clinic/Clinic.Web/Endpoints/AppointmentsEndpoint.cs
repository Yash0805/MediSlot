using Clinic.Core.Dtos;
using Clinic.Core.Request;
using Clinic.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Clinic.Web.Endpoints;

public static class AppointmentsEndpoint
{
    public static IEndpointRouteBuilder MapAppointmentsEndpoints(this IEndpointRouteBuilder endpoint)
    {
        ArgumentNullException.ThrowIfNull(endpoint);
        endpoint.MapGet("Appointments", GetAppointmentsList);
        endpoint.MapGet("Appointments/Report", GetReport);
        endpoint.MapPost("Appointments", CreateAppointmentRequest);
        endpoint.MapPatch("Appointments/{id}", PatchAppointmentRequest);
        return endpoint;
    }

    private static Ok<IEnumerable<AppointmentsDto>> GetAppointmentsList(AppointmentsService appointmentsService,
        DateTime? date)
    {
        IEnumerable<AppointmentsDto> appointment = appointmentsService.GetAppointmentsList(date);
        return TypedResults.Ok(appointment);
    }

    private static Ok<ReportDto> GetReport(AppointmentsService appointmentsService, DateTime? date, DateTime? fromDate,
        DateTime? toDate)
    {
        ReportDto report = appointmentsService.GetReport(date, fromDate, toDate);
        return TypedResults.Ok(report);
    }

    private static IResult CreateAppointmentRequest(AppointmentsService appointmentsService,
        CreateAppointmentRequest request)
    {
        try
        {
            AppointmentsDto appointment = appointmentsService.CreateAppointmentRequest(request);
            return TypedResults.Ok(appointment);
        }
        catch (Exception ex)
        {
            return TypedResults.Conflict(new { message = ex.Message });
        }
    }

    private static IResult PatchAppointmentRequest(AppointmentsService appointmentsService, int id)
    {
        AppointmentsDto? appointment = appointmentsService.PatchAppointmentRequest(id);
        return appointment != null
            ? TypedResults.Ok(appointment)
            : TypedResults.BadRequest("Failed to update appointment. Please check the provided data and try again.");
    }
}
